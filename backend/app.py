import os
import numpy as numpy
from flask import Flask, request
from flask_cors import CORS
import json
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    #load model
    #model=load_model()
    formData=request.get_json()
    #Probably some data manipulation stuff
    #prediction=model.predict(data)
    return formData
