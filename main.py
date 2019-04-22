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


@app.route('/add_info_to_db', methods=['POST'])
def add_info_to_db():
    """
    {
        "name" :"tseng",
        "gender" : 18,
        "birthday" : "2019/04/11",
        "phone_number" : "0918338687",
        "email" : "zengyuhuei@gmail.com",
        "identification_id" : "F123456789",
        "account" : "123456",
        "address" : "ananaana",
        "picture" : "file.jpg"
    }
    """
    response = {"status":"ok"}
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = request.get_json()
        print(data)
        """
        {
            'name': 'tseng', 
            'gender': 18, 
            'birthday': '2019/04/11',
            'phone_number': '0918338687',
            'email': 'zengyuhuei@gmail.com', 
            'identification_id': 'F123456789', 
            'account': '123456',
            'address': 'ananaana',
            'picture': 'file.jpg'
        }
        """
    
        # 傳進來的 Date String 轉成 Datetime 類別
        data["birthday"] = datetime.strptime(data["birthday"], '%Y/%m/%d')
        print(data)
        """
        'birthday': datetime.datetime(2019, 4, 11, 0, 0), 
        """
        
        # 把 DICT 加到資料庫
        model.add_one_to_db(data)
    except Exception as e:
        response["status"] = "error"
        print("sss")
        print(str(e))
    
    return json.dumps(response)


@app.route('/getInfo', methods=['GET'])
def get_info():
    response = {"status":"ok"}
    try:
        id = request.args.get('id')
        response = model.get_info_from_db(id)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return str(response)

    
def Flrun():
    app.run(host='0.0.0.0', port=3000, debug=True)

def Werun():
    websocket.new_server()
if __name__ == '__main__':
    flaskThread = threading.Thread(target = Flrun)
    socketThread = threading.Thread(target = Werun)

    flaskThread.start()
    socketThread.start()