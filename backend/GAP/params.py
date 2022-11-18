import os
import sys
import json

import random
import numpy as np
import torch


with open('./GAP/params.json') as json_file:
    args = json.load(json_file)
random.seed(args['seed'])
np.random.seed(args['seed'])
torch.manual_seed(args['seed'])
args['n_gpu'] = torch.cuda.device_count()

if args['n_gpu'] > 0:
    torch.cuda.manual_seed_all(args['seed'])
