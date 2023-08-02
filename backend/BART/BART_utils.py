import os
import numpy as np
import torch
import random

from transformers import BartTokenizer
from transformers import AdamW, get_linear_schedule_with_warmup

from BART.modeling_bart import BartForConditionalGeneration as Bart

from BART.data import EventDataLoader, EventDataset
import BART.params

def BART_predict_instance(model_name, data):
    #load model/tokenizer here
    model_path = BART.params.args['model_path']+model_name
    tokenizer_path = BART.params.args['tokenizer_path']
    
    #tokenizer
    print("TOKENIZER PATH")
    print(tokenizer_path)
    tokenizer = BartTokenizer.from_pretrained(tokenizer_path)
    
    #model
    model = Bart.from_pretrained(model_path)
        
    if torch.cuda.is_available():
        model.to(torch.device("cuda"))
        
    #dataset
    dataset = EventDataset(BART.params.args, data, tokenizer, "val")
    dataloader = EventDataLoader(BART.params.args, dataset, "val")

    #prediction
    predictions = []
    for i, batch in enumerate(dataloader):
        if torch.cuda.is_available():
            batch = [b.to(torch.device("cuda")) for b in batch]
        outputs = model.generate(input_ids=batch[0],
                                 attention_mask=batch[1],
                                 num_beams=BART.params.args['num_beams'],
                                 length_penalty=BART.params.args['length_penalty'],
                                 max_length=BART.params.args['max_output_length'],
                                 early_stopping=True,)
       
        # Convert ids to tokens
        for output in outputs:
            pred = tokenizer.decode(output, skip_special_tokens=True, clean_up_tokenization_spaces=BART.params.args['clean_up_spaces'])
            predictions.append(pred.strip())
        print(predictions)
    return predictions[0]
