from flask import Flask, jsonify, redirect, url_for, request,render_template, send_file, session
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
app.secret_key = "my precious"
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





@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form.get['uname1'] != 'admin' or request.form.get['pwd1'] != 'admin':
            error = "Login Error"
        else:
            session['logged_in'] = True
            return render_template('driver_index.html')           
    return render_template('login.html')

@app.route('/logout', methods=['GET'])
def logout():
    session['logged_in', None]
    return render_template('login.html')           


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

@app.route('/bus_driver_change_password', methods=['GET'])
def bus_driver_change_password():
    return render_template('bus_driver_change_password.html')

@app.route('/bus_driver_emergency_return', methods=['GET'])
def bus_driver_emergency_return():
    return render_template('bus_driver_emergency_return.html')

@app.route('/bus_driver_people_number_return', methods=['GET'])
def bus_driver_people_number_return():
    return render_template('bus_driver_people_number_return.html')

@app.route('/bus_driver_personal_basic_information', methods=['GET'])
def bus_driver_personal_basic_information():
    return render_template('bus_driver_personal_basic_information.html')

@app.route('/add_busdriver', methods=['GET'])
def add_busdriver():
    return render_template('add_busdriver.html', methods=['GET'])

@app.route('/add_or_revise_shift', methods=['GET'])
def add_or_revise_shift():
    return render_template('add_or_revise_shift.html', methods=['GET'])

@app.route('/bus_information', methods=['GET'])
def bus_information():
    return render_template('bus_information.html')

@app.route('/change_password', methods=['GET'])
def change_password():
    return render_template('change_password.html', methods=['GET'])

@app.route('/Emergency_reception', methods=['GET'])
def Emergency_reception():
    return render_template('Emergency_reception.html')

@app.route('/historical_record', methods=['GET'])
def historical_record():
    return render_template('historical_record.html')

@app.route('/Human_dispatch', methods=['GET'])
def Human_dispatch():
    return render_template('Human_dispatch.html')

@app.route('/Personal_basic_information', methods=['GET'])
def Personal_basic_information():
    return render_template('Personal_basic_information.html')

@app.route('/revise_path', methods=['GET'])
def revise_path():
    return render_template('revise_path.html', methods=['GET'])

@app.route('/timely_bus_information', methods=['GET'])
def timely_bus_information():
    return render_template('timely_bus_information.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)