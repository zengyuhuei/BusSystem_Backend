from flask import Flask, jsonify, redirect, url_for, request,render_template, send_file, session
from flask import jsonify
import json
from model import Model
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename
import warnings
from functools import wraps

from bson import ObjectId

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

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args,**kwargs)
        else:
            return redirect(url_for('login'))
    return wrap



@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    account = None
    if request.method == 'POST':
        account = request.form['account']
        password = request.form['password']
        ans = model.authentication(account,password)
        result = model.authentication(request.form['account'],request.form['password'])
        print("account = "+account)
        if  result == False:
            error = "帳號或密碼錯誤，請重新輸入!"
        elif result['identity'] == 0:
            session['logged_in'] = True
            account = result['account']
            session['store'] = account
            print("account0 = "+account)
            return redirect(url_for('manager_index', account = account))
        elif result['identity'] == 1:
            session['logged_in'] = True
            account = result['account']
            session['store'] = account
            print("account1 = "+account)
            return redirect(url_for('driver_index', account = account))
    return render_template('login.html' ,error = error)
    
 
@app.route('/driver_index', methods=['GET'])
@login_required
def driver_index():       
    return render_template('driver_index.html')

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))           

#add driver to db
@app.route('/add_driver_to_db', methods=['POST'])
@login_required
def add_driver_to_db():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = dict()
        acc_data = dict()
        data['name'] = request.form.get("name")
        data['gender'] = request.form.get("gender")
        data['birthday'] = request.form.get("birthday")
        data['phone_number'] = request.form.get("phone_number")
        data['email'] = request.form.get("email")
        data['identification_id'] = request.form.get("identification_id")
        data['address'] = request.form.get("address")
        upload(data)
        # 傳進來的 Date String 轉成 Datetime 類別
        data["birthday"] = datetime.strptime(data["birthday"], '%Y/%m/%d')
        print(data)
        acc_data['account'] = request.form.get("email")
        acc_data['password'] = request.form.get("birthday").replace("/", "")
        acc_data['identity'] = 1
        print(acc_data)
        # 把 DICT 加到資料庫
        model.add_driver_to_db(data,acc_data)
        success = "新增成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "新增失敗"
        print(response,str(e))
    if response['status'] == "ok":
        return render_template('add_busdriver.html',success = success)
    return render_template('add_busdriver.html',error = error)


#modify info
@app.route('/modify_info_to_db', methods=['POST'])
@login_required
def modify_info_to_db():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = dict()
        data['_id'] = ObjectId(request.form.get("id"))
        data['phone_number'] = request.form.get("phone_number")
        data['account'] = request.form.get("account")
        data['address'] = request.form.get("address")
        upload(data)
        print(data)
        # 傳進來的 Date String 轉成 Datetime 類別
        print(data)
        # 把 DICT 加到資料庫
        model.modify_info_to_db(data)
        message = "修改成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "修改失敗"
        print(response,str(e))
    if response['status'] == "ok":
        return redirect(url_for('bus_driver_personal_basic_information',success = success))
    return redirect(url_for('bus_driver_personal_basic_information',error = error))
    

@app.route('/getInfo', methods=['GET'])
@login_required
def get_info():
    response = {"status":"ok"}
    try:
        email = session['store']
        response = model.get_info_from_db(email)
        print(response)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return str(response)

@app.route('/getShift', methods=['GET'])
def get_shift():
    response = {"status":"ok"}
    try:
        data = request.get_json()
        response = model.get_shift_from_db(data)
        print(response)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return str(response)

@app.route('/addShift', methods=['POST'])
def add_shift():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = request.get_json()
        # 傳進來的 Date String 轉成 Datetime 類別
        data["start_time"] = datetime.strptime(data["start_time"], '%H:%M')
        print(data)
        # 把 DICT 加到資料庫
        model.add_shift_to_db(data)
        success = "新增成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "新增失敗"
        print(str(e))
    return str(response)
    """
    if response['status'] == "ok":
        return redirect(url_for('add_or_revise_shift', success = success))
    return redirect(url_for('add_or_revise_shift', error = error))
    """

@app.route('/bus_driver_change_password', methods=['GET'])
@login_required
def bus_driver_change_password():
    return render_template('bus_driver_change_password.html')

@app.route('/bus_driver_emergency_return', methods=['GET'])
@login_required
def bus_driver_emergency_return():
    return render_template('bus_driver_emergency_return.html')

@app.route('/bus_driver_people_number_return', methods=['GET'])
@login_required
def bus_driver_people_number_return():
    return render_template('bus_driver_people_number_return.html')

@app.route('/bus_driver_personal_basic_information', methods=['GET'])
@login_required
def bus_driver_personal_basic_information():
    return render_template('bus_driver_personal_basic_information.html')

@app.route('/add_busdriver', methods=['GET'])
@login_required
def add_busdriver():
    return render_template('add_busdriver.html', methods=['GET'])

@app.route('/add_or_revise_shift', methods=['GET'])
@login_required
def add_or_revise_shift():
    return render_template('add_or_revise_shift.html', methods=['GET'])

@app.route('/bus_information', methods=['GET'])
@login_required
def bus_information():
    return render_template('bus_information.html')

@app.route('/change_password', methods=['GET'])
@login_required
def change_password():
    return render_template('change_password.html', methods=['GET'])

@app.route('/Emergency_reception', methods=['GET'])
@login_required
def Emergency_reception():
    return render_template('Emergency_reception.html')

@app.route('/historical_record', methods=['GET'])
@login_required
def historical_record():
    return render_template('historical_record.html')

@app.route('/Human_dispatch', methods=['GET'])
@login_required
def Human_dispatch():
    return render_template('Human_dispatch.html')

@app.route('/Personal_basic_information', methods=['GET'])
@login_required
def Personal_basic_information():
    return render_template('Personal_basic_information.html')

@app.route('/revise_path', methods=['GET'])
@login_required
@login_required
def revise_path():
    return render_template('revise_path.html', methods=['GET'])

@app.route('/timely_bus_information', methods=['GET'])
@login_required
def timely_bus_information():
    return render_template('timely_bus_information.html')


@app.route('/manager_index', methods=['GET'])
@login_required
def manager_index():
    return render_template('manager_index.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)