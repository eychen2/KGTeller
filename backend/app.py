import os
import numpy as numpy
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from GAP.GAP_utils import GAP_predict_instance
from JointGT.JointGT_utils import JointGT_predict_instance
from BART.BART_utils import BART_predict_instance


from data_process.process_graph import format_data_BART

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    formData = None
    response=request.get_json()
    data = response['data']
    
    
    processedData = format_data_BART(data)
    models = response['model']
    formDataList = []
    print(models)
    for model in models:
        if model == "BART":
            formDataList.append(BART_predict_instance(model,processedData))
        elif model == "JointGT": 
            formDataList.append(JointGT_predict_instance(model,processedData))
        elif model == "GAP":
            formDataList.append(GAP_predict_instance(model,processedData))
        else:
            formDataList.append(GAP_predict_instance(model.split()[0],processedData, True))
            
    print("outputs: ")
    print(formDataList)
    return jsonify(formDataList)
