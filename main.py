from flask import Flask, jsonify, request
import json
from model import Model
from flask_cors import CORS
from datetime import datetime, timedelta
import threading
import websocket

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

def Flrun():
    app.run(host='0.0.0.0', port=3000, debug=True)

def Werun():
    websocket.new_server()

if __name__ == '__main__':
    flaskThread = threading.Thread(target = Flrun)
    socketThread = threading.Thread(target = Werun)

    flaskThread.start()
    socketThread.start()