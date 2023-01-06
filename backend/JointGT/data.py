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

        self.head_ids, self.rel_ids, self.tail_ids = self.tokenizer.encode(' [head]', add_special_tokens=False), \
                                                     self.tokenizer.encode(' [relation]', add_special_tokens=False), \
                                                     self.tokenizer.encode(' [tail]', add_special_tokens=False)
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

    def linearize_v2(self, triple, entity_change, head_ids, rel_ids, tail_ids,
                        relation_change, cnt_edge, adj_matrix):
        # string_label: encoder ids
        # string_label_tokens: encoder tokens

        if len(triple[0]) == 0:
            return [], '', [], [], cnt_edge, adj_matrix
        nodes, edges = [], []
        string_label = copy.deepcopy(head_ids)
        string_label_tokens = ' [head]'
        nodes.extend([-1] * len(string_label))
        edges.extend([-1] * len(string_label))

        string_label += entity_change[triple[0]][0]
        string_label_tokens += ' {}'.format(triple[0])
        nodes.extend([entity_change[triple[0]][1]] * len(entity_change[triple[0]][0]))
        edges.extend([-1] * len(entity_change[triple[0]][0]))

        if len(triple[1]) != 0 and len(triple[2]) != 0:
            rel_label = relation_change[triple[1]]
            rel_label_token = copy.deepcopy(triple[1])
            words_label = rel_ids + rel_label + tail_ids + entity_change[triple[2]][0]
            words_label_tokens = ' [relation] {} [tail] {}'.format(rel_label_token, triple[2])
            nodes.extend(
                    [-1] * (len(rel_ids) + len(rel_label) + len(tail_ids)) + [entity_change[triple[2]][1]] * len(
                        entity_change[triple[2]][0]))
            edges.extend([-1] * len(rel_ids) + [cnt_edge] * len(rel_label) + [-1] * (
                        len(tail_ids) + len(entity_change[triple[2]][0])))
            if entity_change[triple[0]][1] < len(adj_matrix) and entity_change[triple[2]][1] < len(adj_matrix):
                adj_matrix[entity_change[triple[0]][1]][entity_change[triple[2]][1]] = cnt_edge

            cnt_edge += 1
            string_label += words_label
            string_label_tokens += words_label_tokens

        assert len(string_label) == len(nodes) == len(edges)

        return string_label, string_label_tokens, nodes, edges, cnt_edge, adj_matrix

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
    

    def truncate_pair_ar(self, a, add_bos_id, graph_ids, text_ids, node_ids, edge_ids):
        # add_bos_id + graph_ids + a + text_ids + b + eos_token_id
        length_a_b = self.args.max_input_length - len(add_bos_id) - len(graph_ids) - len(text_ids) - 1
        if len(a) > length_a_b:
            a = a[:length_a_b]
            node_ids = node_ids[:length_a_b]
            edge_ids = edge_ids[:length_a_b]
        input_ids = add_bos_id + graph_ids + a + text_ids + [self.tokenizer.eos_token_id]
        input_node_ids = [-1] * (len(add_bos_id) + len(graph_ids)) + node_ids + [-1] * (len(text_ids) + 1)
        input_edge_ids = [-1] * (len(add_bos_id) + len(graph_ids)) + edge_ids + [-1] * (len(text_ids) + 1)
        attn_mask = [1] * len(input_ids) + [0] * (self.args.max_input_length - len(input_ids))
        input_ids += [self.tokenizer.pad_token_id] * (self.args.max_input_length - len(input_ids))
        input_node_ids += [-1] * (self.args.max_input_length - len(input_node_ids))
        input_edge_ids += [-1] * (self.args.max_input_length - len(input_edge_ids))
        assert len(input_ids) == len(attn_mask) == self.args.max_input_length == len(input_node_ids) == len(
            input_edge_ids)
        return input_ids, attn_mask, input_node_ids, input_edge_ids

    def ar_prep_data(self, answers, questions, add_bos_id, graph_ids, text_ids, node_ids, edge_ids):
        # add bos and eos
        decoder_label_ids = copy.deepcopy(answers)
        if len(decoder_label_ids) > self.args.max_output_length - len(add_bos_id) - 1:
            decoder_label_ids = decoder_label_ids[:(self.args.max_output_length - len(add_bos_id) - 1)]
        decoder_label_ids = add_bos_id + decoder_label_ids + [self.tokenizer.eos_token_id]
        decoder_attn_mask = [1] * len(decoder_label_ids) + [0] * (self.args.max_output_length - len(decoder_label_ids))
        decoder_label_ids += [self.tokenizer.pad_token_id] * (self.args.max_output_length - len(decoder_label_ids))
        assert len(decoder_label_ids) == self.args.max_output_length == len(decoder_attn_mask)

        input_ids, input_attn_mask, input_node_ids, input_edge_ids = self.truncate_pair_ar(questions, add_bos_id,
                                                                                           graph_ids, text_ids,
                                                                                           node_ids, edge_ids)

        return input_ids, input_attn_mask, decoder_label_ids, decoder_attn_mask, input_node_ids, input_edge_ids

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
        node_ids = []
        edge_ids = []
        strings_label_tokens = ''

        # mark_entity: entities with KB numbers which are important for this task
        # text_entity: entities without KB numbers but only with text, which are less important
        # mark_entity = [entry['kbs'][ele_entity][0] for ele_entity in entities]
        # mark_entity_number = entities
        # text_entity, text_relation = self.get_all_entities_per_sample(mark_entity_number, mark_entity, entry)
        text_entity, text_relation = self.get_all_entities_per_sample(kg_list)
        entity_change, relation_change = self.get_change_per_sample(text_entity, text_relation)
        # total_entity = mark_entity + text_entity
        adj_matrix = [[-1] * (self.args.max_node_length + 1) for _ in range(self.args.max_node_length + 1)]

        cnt_edge = 0

        for i, triple in enumerate(kg_list):
            string_label, string_label_tokens, nodes, edges, cnt_edge, adj_matrix = self.linearize_v2(
                triple,
                entity_change,
                self.head_ids,
                self.rel_ids, self.tail_ids,
                relation_change, cnt_edge, adj_matrix)

            strings_label += string_label
            strings_label_tokens += string_label_tokens
            node_ids += nodes
            edge_ids += edges
            
        words_label_ids, words_label_tokens, words_input_ids, words_input_tokens = [], '', [], ''
        current_text = entry[1]

        for word in current_text.split():
            word_label_ids = self.tokenizer.encode(" {}".format(word), add_special_tokens=False)
            word_label_tokens = copy.deepcopy(word)

            words_label_ids += word_label_ids
            words_label_tokens += ' ' + word_label_tokens

        input_ids_ar, attn_mask_ar, decoder_label_ids, decoder_attn_mask, input_node_ids_ar, input_edge_ids_ar = \
            self.ar_prep_data(words_label_ids, strings_label, self.add_bos_id, self.graph_ids,
                              self.text_ids, node_ids, edge_ids)

        node_length_ar = max(input_node_ids_ar) + 1
        edge_length_ar = max(input_edge_ids_ar) + 1

        def masked_fill(src, masked_value, fill_value):
            return [src[src_id] if src[src_id] != masked_value and src[src_id] < fill_value else fill_value for src_id
                    in range(len(src))]

        input_node_ids_ar, input_edge_ids_ar = masked_fill(input_node_ids_ar, -1, self.args.max_node_length), \
                                               masked_fill(input_edge_ids_ar, -1, self.args.max_edge_length)

        def masked_fill_matrix(adj_matrix_input, masked_value, fill_value):
            adj_matrix_tmp = copy.deepcopy(adj_matrix_input)
            for a_id in range(len(adj_matrix_tmp)):
                for b_id in range(len(adj_matrix_tmp)):
                    if adj_matrix_tmp[a_id][b_id] == masked_value or adj_matrix_tmp[a_id][b_id] > fill_value:
                        adj_matrix_tmp[a_id][b_id] = fill_value
            return adj_matrix_tmp

        adj_matrix_ar = masked_fill_matrix(adj_matrix, -1, self.args.max_edge_length)

        assert len(input_ids_ar) == len(attn_mask_ar) == self.args.max_input_length == len(input_node_ids_ar) == len(
            input_edge_ids_ar)
        assert len(decoder_label_ids) == len(decoder_attn_mask) == self.args.max_output_length

        input_ids_ar = torch.LongTensor(input_ids_ar)
        attn_mask_ar = torch.LongTensor(attn_mask_ar)
        decoder_label_ids = torch.LongTensor(decoder_label_ids)
        decoder_attn_mask = torch.LongTensor(decoder_attn_mask)
        input_node_ids_ar = torch.LongTensor(input_node_ids_ar)
        input_edge_ids_ar = torch.LongTensor(input_edge_ids_ar)
        node_length_ar = torch.LongTensor([node_length_ar])
        edge_length_ar = torch.LongTensor([edge_length_ar])
        adj_matrix_ar = torch.LongTensor(adj_matrix_ar)

        return input_ids_ar, attn_mask_ar, decoder_label_ids, decoder_attn_mask, \
               input_node_ids_ar, input_edge_ids_ar, node_length_ar, edge_length_ar, adj_matrix_ar
