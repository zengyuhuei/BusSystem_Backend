from flask import Flask, jsonify, request
import json
from model import Model
from flask_cors import CORS

from datetime import datetime, timedelta


model = Model()

# init Flask 
app = Flask(__name__)
CORS(app) 

#Route
@app.route('/')
def index():
    return 'Hello World!'

@app.route('/testPost', methods=['POST'])
def hahaha():
    data = request.get_json()
    print("name = " + data["name"])
    print("age = " + str(data["age"]))
    return 'Hello World!: ' 



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)