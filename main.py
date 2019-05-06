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
import platform
from bson import ObjectId
import csv
import json
import copy
#---------------------------------------------------
import uuid  # 為了上傳csv檔import
#-----------------------------------------------------

#---------------------------------------------------
import uuid  # 為了上傳csv檔import
import platform
#import pandas
import csv
#-----------------------------------------------------
if platform.system() == "Windows":
  slash = '\\'
else:
  platform.system()=="Linux"
  slash = '/'
#----------------------------------------------------

# init Flask 
app = Flask(__name__)

#---------------------------------------------------

CORS(app)
model = Model()
app.secret_key = "my precious"
#上傳文件儲存路徑
UPLOAD_FOLDER = 'picture'
UPLOAD_FOLDER_CSV = 'csv'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_FOLDER_CSV'] = UPLOAD_FOLDER_CSV
#配置文件大笑
app.config['MAX_CONTENT_LENGTH'] = 16*1024*1024
basedir = os.path.abspath(os.path.dirname(__file__))
#檔案類型
ALLOWED_EXTENSION = (['jpg','JPEG','JPG','png', 'PNG', 'jpeg'])
ALLOWED_EXTENSION_CSV = (['csv'])
#determint the ext of file is legal or not
def allowed_file(filename):
    return "." in filename and filename.split('.')[1] in ALLOWED_EXTENSION

def allowed_csv_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSION_CSV

#get the size of file
def get_FileSize(filePath):
    filePath = unicode(filePath, "utf8")
    fsize = os.path.getsize(filePath)
    fsize = fsize / float(1024*1024)
    return round(fsize,2)

def upload(data):
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
    file_dir_csv = os.path.join(basedir, app.config['UPLOAD_FOLDER_CSV'])
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    elif not os.path.exists(file_dir_csv):
        os.makedirs(file_dir_csv)
    else:
        pass
    #take the file from frontend 
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
    elif f and  allowed_csv_file(f.filename):
        fname = secure_filename(f.filename)
        data['csv'] = fname
        ext = fname.split('.')[1]
        #save the file
        f.save(os.path.join(file_dir_csv, f.filename))
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

#-------------------------------------------------------------------------------------
def read_csv():

    route_list = []
    with open('./templates/route.csv', newline='', encoding="gbk") as csvfile:
      # 讀取 CSV 檔案內容
      rows = csv.reader(csvfile)
      # 以迴圈輸出每一列
      for row in rows:
        route_list.append({'route':row[0],'a':row[1],'b':row[2]})
    route_list.remove({'route': 'route', 'a': 'a', 'b': 'b'})
    print(route_list)
    
""" !!!!!!!!!!!!!!!unicode error unsolved!!!!!!!!!!!!!!!!!!
    with open('./templates/route.csv', 'r', encoding='utf-8', errors='ignore') as infile, open('./templates/final.csv', 'w') as outfile:
        inputs = csv.reader(infile)
        output = csv.writer(outfile)
        for index, row in enumerate(inputs):
            # Create file with no header
            if index == 0:
                continue
            output.writerow(row)

   data = pandas.read_csv('./templates/final.csv')
   print(data.head())
   for i in data.head(0):
       print(data[i].tolist())
"""
    #-------------------------------------------------------------------------------------

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
            return render_template('driver_index.html', account = account)
    return render_template('login.html',error = error)
    
 
@app.route('/driver_index', methods=['GET'])
@login_required
def driver_index():       
    account = None
    try:
        account = request.args.get('account')
    except:
        pass
    return render_template('driver_index.html',account = account, methods=['GET'])

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
        return redirect(url_for('add_busdriver',success = success))
    return redirect(url_for('add_busdriver',error = error))


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
        data['email'] = request.form.get("email")
        data['phone_number'] = request.form.get("phone_number")
        data['account'] = request.form.get("account")
        data['address'] = request.form.get("address")
        upload(data)
        print(data)
        # 傳進來的 Date String 轉成 Datetime 類別
        print(data)
        # 把 DICT 加到資料庫
        identity = model.modify_info_to_db(data)
        print(identity)
        success = "修改成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "修改失敗"
        print(response)
    if identity == 0:
        if response['status'] == "ok":
            return redirect(url_for('Personal_basic_information',success = success))
        else:
            return redirect(url_for('Personal_basic_information',error = error))
    elif identity == 1:
        if response['status'] == "ok":
            return redirect(url_for('bus_driver_personal_basic_information',success = success))
        else:
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

@app.route('/getDriver', methods=['POST'])
@login_required
def get_driver():
    response = {"status":"ok"}
    try:
        response = model.get_driver_from_db()
        print(response)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return jsonify(response)

@app.route('/getShift', methods=['POST'])
@login_required
def get_shift():
    response = {"status":"ok"}
    try:
        data = request.get_json()
        print("SS")
        print(request)
        response = model.get_shift_from_db(data)
    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return str(response)

@app.route('/modifyShift', methods=['POST'])
@login_required
def modify_shift():
    error = None
    success = None
    response = {"status":"ok"}    
    try:
        data = request.get_json()
        data["start_time"] = datetime.strptime(data["start_time"], '%H:%M')
        model.modify_shift_from_db(data)
        success = "修改成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "修改失敗"    
    if response["status"] == "ok":
        return redirect(url_for('add_or_revise_shift',  success = success))
    return redirect(url_for('add_or_revise_shift', error = error))

@app.route('/delShift', methods=['POST'])
@login_required
def del_shift():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        data = request.get_json()
        data["_id"] = ObjectId(data['_id'])
        model.del_shift_from_db(data)
        print(data)
        success = "刪除成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "刪除失敗"
        print(response)
    if response['status'] == "ok":
        return redirect(url_for('add_or_revise_shift',  success = success))
    return redirect(url_for('add_or_revise_shift', error = error))

@app.route('/addShift', methods=['POST'])
@login_required
def add_shift():
    error = None
    success = None
    inserted_id = None
    response = {"status":"ok"}
    print(request)
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = request.get_json()
        # 傳進來的 Date String 轉成 Datetime 類別
        data["start_time"] = datetime.strptime(data["start_time"], '%H:%M')
        print(data)
        # 把 DICT 加到資料庫
        result = model.add_shift_to_db(data)
        result_dict = json.loads(result)
        print(result_dict)
        inserted_id = result_dict['inserted_id']
        print(inserted_id)
        success = "新增成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "新增失敗"
        print(response, str(e))

    if response['status'] == "ok":
        return redirect(url_for('add_or_revise_shift', success = success, inserted_id = inserted_id))
    return redirect(url_for('add_or_revise_shift', error = error))
    
@app.route('/peoplenum_to_db', methods=['POST'])
@login_required
def peoplenum_to_db():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        # 傳進來的 JSON String 轉成 LIST json decode
        data = request.get_json()
        # 傳進來的 Date String 轉成 Datetime 類別
        #data["start_time"] = datetime.strptime(data["start_time"], '%H:%M')
        print(data['peoplenum'])
        model.buspeople_to_db(data)
        success = "上傳成功"
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "上傳失敗"
        print(response)

    if response['status'] == "ok":
        return redirect(url_for('bus_driver_people_number_return',success = success))
    else:
        return redirect(url_for('bus_driver_people_number_return',error = error))

@app.route('/changePassword', methods=['POST'])
@login_required
def changePassword():
    error = None
    success = None
    response = {"status":"ok"}
    try:
        data = request.get_json()
        identity = model.change_password_to_db(data)
        success = "修改成功"
        print(identity)
    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "修改失敗"
        print(response)
    
    return str(response)
    if identity == 0:
        if response['status'] == "ok":
            return redirect(url_for('change_password',success = success))
        else:
            return redirect(url_for('change_password',error = error))
    elif identity == 1:
        if response['status'] == "ok":
            return redirect(url_for('bus_driver_change_password',success = success))
        else:
            return redirect(url_for('bus_driver_change_password',error = error))

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
    success = None
    error = None
    try:
        success = request.args.get('success')
        error = request.args.get('error')
    except:
        pass
    return render_template('bus_driver_personal_basic_information.html', success = success, error = error, methods=['GET'])
    

@app.route('/add_busdriver', methods=['GET'])
@login_required
def add_busdriver():
    success = None
    error = None
    try:
        success = request.args.get('success')
        error = request.args.get('error')
    except:
        pass
    return render_template('add_busdriver.html', success = success, error = error, methods=['GET'])

@app.route('/add_or_revise_shift', methods=['GET'])
@login_required
def add_or_revise_shift():
    success = None
    error = None
    inserted_id = None
    try:
        success = request.args.get('success')
        inserted_id =  request.args.get('inserted_id')
        error = request.args.get('error')
    except:
        pass
    return render_template('add_or_revise_shift.html', success = success,  inserted_id = inserted_id, error = error, methods=['GET'])

def get_routelist(data):
    temp = []
    temp = copy.deepcopy(data)
    for one in temp:
        one.pop('lat')
        one.pop('lng')
    
    routelist = []
    routename = temp[0].keys()
    for name in routename:
        if name.isdigit():
            route = dict()
            temp.sort(key = lambda temp:int(temp[name]))    
            for one in temp:
                route['bus_route'] = name
                if(one[name] != '0'):
                    route[one[name]] = one['route']
            routelist.append(route)

    return routelist

@app.route('/busGps_to_db',methods=['POST'])
@login_required
def busGps_to_db():
    error = None
    success = None
    response = {"status":"ok"}
    data = dict()
    upload(data)
    try:
        csv_data = dict()
        csv_dir = 'csv/'+request.files['myfile'].filename
        with open(csv_dir) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            csv_data = [{title[i]:row[title[i]] for i in range(5)}  for row in reader]
			
        print(csv_data)
        for data in csv_data:
            data['lat'] = float(data['lat'])
            data['lng'] = float(data['lng'])
        
        routelist = dict()
        routelist = get_routelist(csv_data)
		
        csvkey = csv_data[0].keys()
        routename = []
        for name in csvkey:
            if name.isdigit():
                routename.append(name)
        for data in csv_data:
            for name in routename:
                data.pop(name)
                
        model.busGps_to_db(csv_data,routelist)

        success = "上傳成功"

    except Exception as e:
        response["status"] = "error"
        response["error"] = str(e)
        error = "上傳失敗"
        print(response,str(e))
    if response['status'] == "ok":
        return redirect(url_for('revise_path',success = success))
    return redirect(url_for('revise_path',error = error))


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
    success = None
    error = None
    try:
        success = request.args.get('success')
        error = request.args.get('error')
    except:
        pass
    return render_template('Personal_basic_information.html', success = success, error = error, methods=['GET'])


@app.route('/revise_path', methods=['GET'])
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
    account = None
    try:
        account = request.args.get('account')
    except:
        pass
    return render_template('manager_index.html',account = account, methods=['GET'])

@app.route('/getRoute', methods=['POST'])
def get_route():
    response = {"status":"ok"}
    try:
        getRoute = request.get_json()
        response = model.get_route_from_db(getRoute)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return jsonify(response)

@app.route('/getbusGPS', methods=['POST'])
def get_busGPS():
    response = {"status":"ok"}
    try:
        getRoute = request.get_json()
        response = model.get_busGPS_from_db(getRoute)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return jsonify(response)

@app.route('/setbusGPS', methods=['POST'])
def set_busGPS():
    response = {"status":"ok"}
    try:
        getdata = request.get_json() #拿時間&姓名
        print("hahaha")
        print(getdata)
        response = model.set_busGPS_into_db(getdata)

    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return jsonify(response)

@app.route('/getbusNumber', methods=['POST'])
@login_required
def get_busNumber():
    response = {"status":"ok"}
    try:
        data = request.get_json()
        print("inside main-getbusNumber")
        response = model.get_busNumber_from_db(data)
        print(response)
    except Exception as e:
        response["status"] = "error"
        print(str(e))
    return response

'''
#--------------------------------------------------------------------------
@app.route('/upload_file',methods=['GET','POST'])
@login_required
def upload_file():
  if request.method =='POST':
    #獲取post過來的檔名稱，從name=file引數中獲取
    file = request.files['customeFile']
    if file and allowed_file(file.filename):
      # secure_filename方法會去掉檔名中的中文
      filename = secure_filename(file.filename)
      #因為上次的檔案可能有重名，因此使用uuid儲存檔案
      file_name = str(uuid.uuid4()) + '.' + filename.rsplit('.', 1)[1]
      file.save(os.path.join(app.config['UPLOAD_FOLDER2'],file_name))
      base_path = os.getcwd()
      file_path = base_path + slash + app.config['UPLOAD_FOLDER2'] + slash + file_name
      print(file_path)
      return redirect(url_for('upload_file',filename = file_name))
#--------------------------------------------------------------------------

#--------------------------------------------------------------------------
@app.route('/revise_path',methods=['GET','POST'])
def upload_csv_file():
  if request.method =='POST':
    #獲取post過來的檔名稱，從name=file引數中獲取
    file = request.files['file']
    if file and allowed_csv_file(file.filename):
      # secure_filename方法會去掉檔名中的中文
      filename = secure_filename(file.filename)
      #因為上次的檔案可能有重名，因此使用uuid儲存檔案
      file_name = str(uuid.uuid4()) + '.' + filename.rsplit('.', 1)[1]
      file.save(os.path.join(app.config['UPLOAD_FOLDER_CSV'],file_name))
      # 抓upload_csv資料夾內的隨便一個csv檔(在上面創一個function)
      read_csv(file)
      # 抓到之後把它分成兩個db，一個是路線，另一個是經緯度
      base_path = os.getcwd()
      file_path = base_path + slash + app.config['UPLOAD_FOLDER_CSV'] + slash + file_name
      print("file_path :" + file_path)
      return redirect(url_for('upload_csv_file',filename = file_name))
'''
#--------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
