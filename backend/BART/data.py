import os
import json
import re
import string
import numpy as np
from tqdm import tqdm
import sys
import copy
import random
import time

import torch
from torch.utils.data import Dataset, TensorDataset, DataLoader, RandomSampler, SequentialSampler

# Downstream dataset
class EventDataLoader(DataLoader):

    def __init__(self, args, dataset, mode):
        if mode == "train":
            sampler = RandomSampler(dataset)
#             sampler = SequentialSampler(dataset)
            batch_size = args.train_batch_size
        else:
            sampler = SequentialSampler(dataset)
            batch_size = args.predict_batch_size
        super(EventDataLoader, self).__init__(dataset, sampler=sampler, batch_size=batch_size,
                                               num_workers=args.num_workers)

class EventDataset(Dataset):
    def __init__(self, args, data, tokenizer, mode):
        self.data = data
        self.tokenizer = tokenizer
                
        print("Total samples = {}".format(len(self.data)))

       
        assert type(self.data) == list
       

        self.args = args
        self.data_type = mode
        self.metric = "BLEU"

        self.head_ids, self.rel_ids, self.tail_ids = self.tokenizer.encode(' <S>', add_special_tokens=False), \
                                                     self.tokenizer.encode(' <P>', add_special_tokens=False), \
                                                     self.tokenizer.encode(' <O>', add_special_tokens=False)
        self.graph_ids, self.text_ids = self.tokenizer.encode(' [graph]', add_special_tokens=False), \
                                        self.tokenizer.encode(' [text]', add_special_tokens=False)

        if self.args.model_name == "bart":
            self.mask_token = self.tokenizer.mask_token
            self.mask_token_id = self.tokenizer.mask_token_id
        else:
            self.mask_token = self.tokenizer.additional_special_tokens[0]
            self.mask_token_id = self.tokenizer.convert_tokens_to_ids(self.tokenizer.additional_special_tokens[0])

        if self.args.model_name == "bart":
            if self.args.append_another_bos:
                self.add_bos_id = [self.tokenizer.bos_token_id] * 2
            else:
                self.add_bos_id = [self.tokenizer.bos_token_id]
        else:
            self.add_bos_id = []

    def __len__(self):
        return len(self.data)

    def linearize_v2(self, triple, entity_change, head_ids, rel_ids, tail_ids, relation_change):
        # string_label: encoder ids
        # string_label_tokens: encoder tokens

        if len(triple[0]) == 0:
            return [], ''
        string_label = copy.deepcopy(head_ids)
        string_label_tokens = ' [head]'

        string_label += entity_change[triple[0]][0]
        string_label_tokens += ' {}'.format(triple[0])

        if len(triple[1]) != 0 and len(triple[2]) != 0:
            rel_label = relation_change[triple[1]]
            rel_label_token = copy.deepcopy(triple[1])
            words_label = rel_ids + rel_label + tail_ids + entity_change[triple[2]][0]
            words_label_tokens = ' [relation] {} [tail] {}'.format(rel_label_token, triple[2])
           
            string_label += words_label
            string_label_tokens += words_label_tokens

        return string_label, string_label_tokens

    def get_all_entities_per_sample(self, triple_list):
        text_entity = set()
        text_relation = set()
        for triple in triple_list:
            if len(triple[0]) == 0:
                continue
            if len(triple[1]) != 0 and len(triple[2]) != 0:
                text_relation.add(triple[1])
                text_entity.add(triple[0])
                text_entity.add(triple[2])
                
        text_entity_list = list(text_entity)+list(text_relation)
        text_relation_list = list(text_relation)
        
        return text_entity_list, text_relation_list

    def get_change_per_sample(self, text_entity, text_relation):
        # during fine-tuning, we don't mask entities or relations
        ent_change = {}
        total_entity = text_entity

        for ent_id in range(len(total_entity)):
            entity_toks = self.tokenizer.encode(" {}".format(total_entity[ent_id]), add_special_tokens=False)
            ent_change[total_entity[ent_id]] = [entity_toks, ent_id]
        # relation change only includes the relation tokens and ids
        rel_change = {}
        for rel_id in range(len(text_relation)):
            rel_change[text_relation[rel_id]] = self.tokenizer.encode(' {}'.format(text_relation[rel_id]),
                                                                      add_special_tokens=False)
            
        return ent_change, rel_change
    

    def truncate_pair_ar(self, a, add_bos_id, graph_ids, text_ids):
        # add_bos_id + graph_ids + a + text_ids + b + eos_token_id
        length_a_b = self.args.max_input_length - len(add_bos_id) - len(graph_ids) - len(text_ids) - 1
        if len(a) > length_a_b:
            a = a[:length_a_b]
        input_ids = add_bos_id + graph_ids + a + text_ids + [self.tokenizer.eos_token_id]
        attn_mask = [1] * len(input_ids) + [0] * (self.args.max_input_length - len(input_ids))
        input_ids += [self.tokenizer.pad_token_id] * (self.args.max_input_length - len(input_ids))
        assert len(input_ids) == len(attn_mask) == self.args.max_input_length
        return input_ids, attn_mask

    def ar_prep_data(self, answers, questions, add_bos_id, graph_ids, text_ids):
        # add bos and eos
        decoder_label_ids = copy.deepcopy(answers)
        if len(decoder_label_ids) > self.args.max_output_length - len(add_bos_id) - 1:
            decoder_label_ids = decoder_label_ids[:(self.args.max_output_length - len(add_bos_id) - 1)]
        decoder_label_ids = add_bos_id + decoder_label_ids + [self.tokenizer.eos_token_id]
        decoder_attn_mask = [1] * len(decoder_label_ids) + [0] * (self.args.max_output_length - len(decoder_label_ids))
        decoder_label_ids += [self.tokenizer.pad_token_id] * (self.args.max_output_length - len(decoder_label_ids))
        assert len(decoder_label_ids) == self.args.max_output_length == len(decoder_attn_mask)

        input_ids, input_attn_mask = self.truncate_pair_ar(questions, add_bos_id, graph_ids, text_ids)

        return input_ids, input_attn_mask, decoder_label_ids, decoder_attn_mask

    def __getitem__(self, idx):

        kg = self.data[idx]
        
        kg_list = []
        triple_list = kg.split('<S>')
        triple_list = [triple_list[0]] + ['<S>'+triple for triple in triple_list[1:]]
        triple_list = list(filter(None,triple_list))
        for triple in triple_list:
            head = re.search('<S>(.*)<P>', triple).group(1).strip()
            rel = re.search('<P>(.*)<O>', triple).group(1).strip()
            tail = re.search('<O>(.*)', triple).group(1).strip()
            kg_list.append([head,rel,tail])

        strings_label = []
        strings_label_tokens = ''

        # mark_entity: entities with KB numbers which are important for this task
        # text_entity: entities without KB numbers but only with text, which are less important
        
        text_entity, text_relation = self.get_all_entities_per_sample(kg_list)
        entity_change, relation_change = self.get_change_per_sample(text_entity, text_relation)

        for i, triple in enumerate(kg_list):
            string_label, string_label_tokens, = self.linearize_v2(
                triple,
                entity_change,
                self.head_ids,
                self.rel_ids, self.tail_ids,
                relation_change)

            strings_label += string_label
            strings_label_tokens += string_label_tokens
           
            
        words_label_ids, words_label_tokens, words_input_ids, words_input_tokens = [], '', [], ''
        current_text = entry[1]

        for word in current_text.split():
            word_label_ids = self.tokenizer.encode(" {}".format(word), add_special_tokens=False)
            word_label_tokens = copy.deepcopy(word)

            words_label_ids += word_label_ids
            words_label_tokens += ' ' + word_label_tokens

        input_ids_ar, attn_mask_ar, decoder_label_ids, decoder_attn_mask = \
            self.ar_prep_data(words_label_ids, strings_label, self.add_bos_id, self.graph_ids,
                              self.text_ids)

        assert len(input_ids_ar) == len(attn_mask_ar) == self.args.max_input_length
        assert len(decoder_label_ids) == len(decoder_attn_mask) == self.args.max_output_length

        input_ids_ar = torch.LongTensor(input_ids_ar)
        attn_mask_ar = torch.LongTensor(attn_mask_ar)
        decoder_label_ids = torch.LongTensor(decoder_label_ids)
        decoder_attn_mask = torch.LongTensor(decoder_attn_mask)

        return input_ids_ar, attn_mask_ar, decoder_label_ids, decoder_attn_mask
