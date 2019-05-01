# -*- coding: utf-8 -*-
"""
Created on Sun Apr 28 14:35:04 2019

@author: by938
"""

# -*- coding: utf-8 -*-
import os
import uuid
import platform
from flask import Flask,request,redirect,url_for
from werkzeug.utils import secure_filename
 
if platform.system() == "Windows":
  slash = '\\'
else:
  platform.system()=="Linux"
  slash = '/'
UPLOAD_FOLDER = 'upload'
ALLOW_EXTENSIONS = set(['html', 'htm', 'doc', 'docx', 'mht', 'pdf'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#判斷資料夾是否存在，如果不存在則建立
if not os.path.exists(UPLOAD_FOLDER):
  os.makedirs(UPLOAD_FOLDER)
else:
  pass
# 判斷檔案字尾是否在列表中
def allowed_file(filename):
  return '.' in filename and \
      filename.rsplit('.', 1)[1] in ALLOW_EXTENSIONS
 
@app.route('/',methods=['GET','POST'])
def upload_file():
  if request.method =='POST':
    #獲取post過來的檔名稱，從name=file引數中獲取
    file = request.files['file']
    if file and allowed_file(file.filename):
      # secure_filename方法會去掉檔名中的中文
      filename = secure_filename(file.filename)
      #因為上次的檔案可能有重名，因此使用uuid儲存檔案
      file_name = str(uuid.uuid4()) + '.' + filename.rsplit('.', 1)[1]
      file.save(os.path.join(app.config['UPLOAD_FOLDER'],file_name))
      base_path = os.getcwd()
      file_path = base_path + slash + app.config['UPLOAD_FOLDER'] + slash + file_name
      print(file_path)
      return redirect(url_for('upload_file',filename = file_name))
  return '''
  <!doctype html>
  <title>Upload new File</title>
  <h1>Upload new File</h1>
  <form action="" method=post enctype=multipart/form-data>
   <p><input type=file name=file>
     <input type=submit value=Upload>
  </form>
  '''
if __name__ == "__main__":
  app.run(host='0.0.0.0',port=5000)