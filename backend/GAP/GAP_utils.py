import os
import numpy as np
import torch
import random

from transformers import BartTokenizer
from transformers import AdamW, get_linear_schedule_with_warmup

from GAP.modeling_gap import GAPBartForConditionalGeneration as GAP_model
from GAP.modeling_gap_type import GAPBartForConditionalGeneration as GAP_Type_model

from GAP.data_relations_as_nodes import GAPDataloader, EventDataset
from GAP.data_relations_as_nodes import get_t_emb_dim
import GAP.params

def GAP_predict_instance(model_name, data, type_encoding=None):
    #load model/tokenizer here
    model_path = GAP.params.args['model_path']+model_name
    tokenizer_path = GAP.params.args['tokenizer_path']
    
    #tokenizer
    tokenizer = BartTokenizer.from_pretrained(tokenizer_path)
    
    #model
    if type_encoding:
        t_emb_dim = get_t_emb_dim(GAP.params.args)
        model = GAP_Type_model.from_pretrained(model_path,t_emb_dim=t_emb_dim)
    else:
        model = GAP_model.from_pretrained(model_path)
        
    if torch.cuda.is_available():
        model.to(torch.device("cuda"))
        
    #dataset
    dataset = EventDataset(GAP.params.args, data, tokenizer, "val")
    dataloader = GAPDataloader(GAP.params.args, dataset, "val")
    
    #prediction
    predictions = []
    for i, batch in enumerate(dataloader):
        if torch.cuda.is_available():
            batch = [b.to(torch.device("cuda")) for b in batch]
        outputs = model.generate(input_ids=batch[0],
                                 attention_mask=batch[1],
                                 input_node_ids=batch[2],
                                 node_length=batch[3],
                                 adj_matrix=batch[4],
                                 num_beams=GAP.params.args['num_beams'],
                                 length_penalty=GAP.params.args['length_penalty'],
                                 max_length=GAP.params.args['max_output_length'],
                                 early_stopping=True,)
       
        # Convert ids to tokens
        for output in outputs:
            pred = tokenizer.decode(output, skip_special_tokens=True, clean_up_tokenization_spaces=GAP.params.args['clean_up_spaces'])
            predictions.append(pred.strip())
    return predictions[0]
    
    