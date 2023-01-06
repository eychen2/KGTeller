import os
import numpy as np
import torch
import random

from transformers import BartTokenizer
from transformers import AdamW, get_linear_schedule_with_warmup

from JointGT.modeling_joint import MyBartForConditionalGeneration as MyBart

from JointGT.data import EventDataLoader, EventDataset
import JointGT.params

def JointGT_predict_instance(model_name, data):
    #load model/tokenizer here
    model_path = JointGT.params.args['model_path']+model_name
    tokenizer_path = JointGT.params.args['tokenizer_path']
    
    #tokenizer
    tokenizer = BartTokenizer.from_pretrained(tokenizer_path)
    
    #model
    model = MyBart.from_pretrained(model_path)
        
    if torch.cuda.is_available():
        model.to(torch.device("cuda"))
        
    #dataset
    dataset = EventDataset(JointGT.params.args, data, tokenizer, "val")
    dataloader = EventDataLoader(JointGT.params.args, dataset, "val")
    
    #prediction
    predictions = []
    for i, batch in enumerate(dataloader):
        if torch.cuda.is_available():
            batch = [b.to(torch.device("cuda")) for b in batch]     
        outputs = model.generate(input_ids=batch[0],
                                 attention_mask=batch[1],
                                 input_node_ids=batch[4],
                                 input_edge_ids=batch[5],
                                 node_length=batch[6],
                                 edge_length=batch[7],
                                 adj_matrix=batch[8],
                                 num_beams=JointGT.params.args['num_beams'],
                                 length_penalty=JointGT.params.args['length_penalty'],
                                 max_length=JointGT.params.args['max_output_length'],
                                 early_stopping=True,)
       
        # Convert ids to tokens
        for output in outputs:
            pred = tokenizer.decode(output, skip_special_tokens=True, clean_up_tokenization_spaces=JointGT.params.args['clean_up_spaces'])
            predictions.append(pred.strip())
        print(predictions)
    return predictions[0]