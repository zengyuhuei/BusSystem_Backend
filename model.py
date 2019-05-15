from pymongo import MongoClient
import pymongo
import json
import time
from datetime import datetime
from bson import ObjectId
import configparser   
from datetime import datetime
class Model:

    def __init__(self):
        self._config = configparser.ConfigParser()
        self._config.read('mongodb.ini')
        self._user = self._config['mongodb']['User']
        self._password = self._config['mongodb']['Password']

    # add_driver_to_db
    def add_driver_to_db(self, data, acc_data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        print(db["auth"].find_one({"account" : acc_data["account"]}))
        if db["auth"].find_one({"account" : acc_data["account"]}) == None:
            info_result = db['info'].insert_one(data)
            account_result = db['auth'].insert_one(acc_data)
            return True
        return False

     # modify info
    def modify_info_to_db(self, data):
        email = dict()
        result = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        email['email'] = data['email']
        account = data['email']
        print(email)
        del data['email']
        print(data)
        db['info'].update_one(email , { "$set": data })
        result =  db["auth"].find_one({"account" : account})
        print(result['identity'])
        return result['identity']
    
    # modify password
    def change_password_to_db(self, data):
        email = dict()
        new_password = dict()
        result = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        email['account'] = data['account']
        email['password'] = data['password']
        account = data['account']
        print(email)
        del data['account']
        del data['password']
        print(data)
        new_password['password'] = data['new_password']
        is_exist = db['auth'].update_one(email , { "$set": new_password })
        if is_exist.matched_count == 0:
            result["exist"] = False
        else:
            result["exist"] = True
        result['identity'] =  db["auth"].find_one({"account" : account})['identity']
        print(result)
        return result
        
            
    
    #get info from db    
    def get_info_from_db(self, email):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["info"].find_one({"email" : email})
        print(result)
        result['_id'] = str(result['_id'])
        result['birthday'] = result['birthday'].strftime("%Y/%m/%d")
        return json.dumps(result)


    
    # modify shift from db
    def modify_shift_from_db(self, data):
        info = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        info['_id'] = ObjectId(data['_id'])
        print(info)
        print("上面是info")
        del data['_id']
        print(data)
        result = db['shift'].update_one(info, { "$set": data })
        return result
    
    # del shft from db
    def del_shift_from_db(self, data):
        info = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        
        print(data)
        if db['shift'].find_one(data) != None:
            result = db['shift'].delete_one(data)
            print("result==========")
            print(result)
            return result
        else:
            return "notExist"

    #get shift from db    
    def get_shift_from_db(self, data):
        print("AA")
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = list(db["shift"].find({"route" : data['route'], "day" : data['day']}))
        
        for info in result:
            info['start_time'] = info['start_time'].strftime("%H:%M")
            info['_id'] = str(info['_id'])
          
        print(result)
        return json.dumps(result)

    # add_shift_to_db
    def add_shift_to_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        data["lat"] = 0.0
        data["lng"] = 0.0
        data["peoplenum"] = 0
        data["arrive_time"] = datetime.now()
        result = db['shift'].insert_one(data)
        print(result.inserted_id)

        return json.dumps({'inserted_id': str(result.inserted_id)})


    def get_info_from_db_all(self):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["auth"]
        
        tempList=[] # 用來存放account和identity的list
        all_account = list(result.find({})) # 原本含有pwd的list
        print("all_account list: ")
        print(all_account)
        for i in range(0,len(all_account)):
            tempDictionary = all_account[i]
            tempDictionary.pop('_id')
            tempDictionary.pop('password')
            tempList.append(tempDictionary)
            
        print("\n\nprint list without _id and password field: ")
        print(tempList)
        
        return tempList
    
    #get driver from db    
    def get_driver_from_db(self):
        name = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        result = list(db["auth"].find({"identity" : 1},{ "_id": 0 , "password": 0, "identity": 0 }))
        print(result)
        for mail in result:
            name.append(db["info"].find_one({"email" : mail['account']},{"_id" : 0, "name": 1 })['name'])
        print(name)
        return name

    # auth
    def authentication(self, account, password):
        client = pymongo.MongoClient('mongodb://'+self._config['mongodb']['User']+':'+self._config['mongodb']['Password']+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        print(account, password)
        result = list(db['auth'].find({'account' : account}))
        if len(result) > 0:
            if result[0]['password'] == password:
                print(result[0])
                return result[0]
        return False

    #add the bus stop coordinate
    def busGps_to_db(self, data_coor,data_route):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        db['busRoad_coor'].drop()
        db['route'].drop()
        db['arrivetime'].drop()
        db['shift'].drop()
        print('its db')
        print(data_route)
        coor_result = db['busRoad_coor'].insert_many(data_coor)
        coor_result = db['route'].insert_many(data_route)
        #print(coor_result)
        return coor_result

    #get route from db    
    def get_route_from_db(self, bus_route):
        position = list()
        print("hi welcome")
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        print(bus_route)
        route_name = bus_route["route"]
        print(route_name)
        route_result = db["route"].find_one({'bus_route' : route_name})
        print(route_result)
        print(len(route_result))
        for i in range(1,len(route_result)-1):
            bus_stop=route_result[str(i)]
            print(bus_stop)
            print(len(route_result))
            position.append(db["busRoad_coor"].find_one({"route" : bus_stop},{"_id" : 0, "route": 1, "lat": 1, "lng": 1 }))
        print(position)
        return position
        #return json.dumps(result)

    #get busGPS from db    
    def get_busGPS_from_db(self, bus_route):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        print(bus_route)
        route_name = bus_route["route"]
        print(route_name) #拿到路線值
        for x in mycol.find({"route" : route_name}, {"_id" : 0, "route": 1, "driver": 1, "lat": 1, "lng": 1}):
            print(x)
            position.append(x)
        print("hey")
        print(position)
        return position
        
    def get_busGPS_from_db_web(self,driver):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        print(driver) #拿到路線值
        for x in mycol.find({"driver" : driver}, {"_id" : 0, "route": 1, "driver": 1, "lat": 1, "lng": 1}):
            print(x)
            position.append(x)
        print("hey")
        print(position)
        return position
    def get_busDriver_from_db_web(self,x):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        print(driver) #拿到路線值
        for x in mycol.find({"_id" : 0, "route": 1, "driver": 1, "lat": 1, "lng": 1}):
            if x['lat']!=0.0 and x['lng']!=0.0
                print(x)
                position.append(x)
        print("hey")
        print(position)
        return position
    #set busGPS to db    
    def set_busGPS_into_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #把時間姓名進去找 符合存進去 //判斷是否符合
        time = data["start_time"]
        name = data["email"]
        lat = data["lat"]
        lng = data["lng"]
        if lat is " ":
            flat = lat
            flng = lng
        else:
            flat = float(lat)
            flng = float(lng)
        print(time)
        print(name)
        print(lat)
        print(lng)
        driver_name = db["info"].find_one({'email' : name}, {"_id" : 0, "name": 1})
        print(driver_name)
        driver = driver_name["name"]
        print(driver)
        #時間還沒都進去 不知道格式 **
        db["shift"].update_one({"driver" : driver}, {"$set": { "lat": flat, "lng": flng }}) 
        print("hi")
        position = "good"
        return position

    #get busNumber from db    
    def get_busNumber_from_db(self, data):
        print("inside busNumber")
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        result = list(db["route"].find({},{"_id" : 0, "bus_route": 1}))
        
        print("下面是要輸出的資料長哪樣")
        print(result)
        return json.dumps(result)
		
    def buspeople_to_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        print('its db')
        print(data['driver'])
        driver_name = db["info"].find_one({'email' : data['driver']}, {"_id" : 0, "name": 1})
        driver = driver_name["name"]
        result = db['shift'].update_many({"driver":driver},{"$set": { "peoplenum": data['peoplenum'], "arrive_time": data['arrive_time']}})
        #print(coor_result)
        return result