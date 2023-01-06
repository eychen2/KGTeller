import os
import json
import re
import ast

def tokenize_text(text):
    text = text.replace('–', ' - ')
    text = text.replace('—', ' - ')
    text = text.replace(u'\u2212', ' - ')
    text = text.replace(u'\u2044', ' - ')
    text = text.replace(u'\xd7', ' x ')
    text = text.replace(u'>\u200b<', u'> <')
    text = text.replace(u'\xa0', u' ')
    # text = text.replace('><ent', '> <ent')
    # text = re.sub(">+(\S)+<ent", r'> \1 <', text)
    text = re.sub('([|.,!?():;&\+\"\'/-])', r' \1 ', text)
    text = text.replace('><e', '> <e')
    text = re.sub('\s{2,}', ' ', text)
    text = text.replace('<entity_','<ENT_')
    return text

def normalize_relations(relation):
    relation = re.sub("([a-z])([A-Z])","\g<1> \g<2>",relation)
    relation = relation.replace('_', ' ')
    return relation

def format_data_BART(dataset):
    if type(dataset) is not list:
        dataset = [dataset]
    triples_data_bart = []
    for data in dataset:
        data = ast.literal_eval(data)
        entity_ref_dict = data['entity_ref_dict']
        triples = data['keep_triples']
       
        
        triples_text = ''
        
        new_triple = []
        for triple in triples:
            subject = triple[0].lower()
            relation = normalize_relations(triple[1]).lower()
            object_ = triple[2].lower()
            new_triple.insert(0,'<S>')
            new_triple.insert(1,subject)
            new_triple.insert(2,'<P>')
            new_triple.insert(3,relation)
            new_triple.insert(4,'<O>')
            new_triple.insert(5,object_)
            new_triple_text = ' '.join(new_triple)
            triples_text = new_triple_text + ' '
        triples_text = triples_text.strip()
        triples_data_bart.append(triples_text)
    return triples_data_bart
  
