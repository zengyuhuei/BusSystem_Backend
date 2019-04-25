from flask import Flask, jsonify, request,render_template,send_file
from flask import jsonify
import json
from model import Model
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename



# init Flask 
app = Flask(__name__)
CORS(app)
model = Model()

#上傳文件儲存路徑
UPLOAD_FOLDER = 'picture'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#配置文件大笑
app.config['MAX_CONTENT_LENGTH'] = 16*1024*1024
basedir = os.path.abspath(os.path.dirname(__file__))
#檔案類型
ALLOWED_EXTENSION = (['jpg','JPEG','JPG','png', 'PNG', 'jpeg'])
#determint the ext of file is legal or not
def allowed_file(filename):
    return "." in filename and filename.split('.')[1] in ALLOWED_EXTENSION

#get the size of file
def get_FileSize(filePath):
    filePath = unicode(filePath, "utf8")
    fsize = os.path.getsize(filePath)
    fsize = fsize / float(1024*1024)
    return round(fsize,2)

def upload(data):
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    else:
        pass
    #take the file from frontend name "picture"
    f = request.files['myfile']
    #判斷文件是否存在且類型符合
    print(f)
    print(allowed_file(f.filename))
    if f and allowed_file(f.filename):
        fname = secure_filename(f.filename)
        data['picture'] = fname
        ext = fname.split('.')[1]
        #save the file
        f.save(os.path.join(file_dir, f.filename))
        return jsonify({"state":"ok", "fname":fname, "ext":ext,"dir":file_dir})
    else:
        return jsonify({"state":"error"})



#Route
@app.route('/')
def index():
    return render_template('index.html')




    
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
        data = dict()
        data['name'] = request.form.get("name")
        data['gender'] = request.form.get("gender")
        data['birthday'] = request.form.get("birthday")
        data['phone_number'] = request.form.get("phone_number")
        data['email'] = request.form.get("email")
        data['identification_id'] = request.form.get("identification_id")
        data['account'] = request.form.get("account")
        data['address'] = request.form.get("address")
        upload(data)
        print(data)
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
        response["error"] = str(e)
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
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)