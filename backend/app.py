import os
import numpy as numpy
from flask import Flask, request
from flask_cors import CORS
import json
from GAP.GAP_utils import GAP_predict_instance
from JointGT.JointGT_utils import JointGT_predict_instance
from BART.BART_utils import BART_predict_instance


from data_process.process_graph import format_data_BART

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    #load model
    #model=load_model()
    response=request.get_json()
    data = response['data']
    model = response['model']
    
    
    
# #     todo: uncomment this to list
#     processedData = format_data_BART(data)
#     models = response['models']
#     formDataDict = dict()
#     for model in models:
#         if model is "BART":
#             formDataDict[model] = BART_predict_instance(model,processedData)
#         elif model is "JointGT":
#             formDataDict[model] = JointGT_predict_instance(model,processedData)
#         else:
#             formDataDict[model] = GAP_predict_instance(model,processedData)
            
   
    #Data processing
    processedData = format_data(data)
    if model is model:
        formData = GAP_predict_instance("Model_e_r_type_event",processedData)
    return formData
