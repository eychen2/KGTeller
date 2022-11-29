import os
import numpy as numpy
from flask import Flask, request
from flask_cors import CORS
import json
from GAP.GAP_utils import GAP_predict_instance
from data_process.process_graph import format_data
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    #load model
    #model=load_model()
    response=request.get_json()
    data = response['data']
    model = response['model']
    
    #Data processing
    processedData = format_data(data)
    if model is model:
        formData = GAP_predict_instance("Model_e_r_type_event",processedData)
    return formData
