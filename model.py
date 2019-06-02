from pymongo import MongoClient
import pymongo
import json
import time
from datetime import datetime, date
from bson import ObjectId
import configparser
from math import sin,cos,sqrt,atan2,radians
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
        del data['email']
        db['info'].update_one(email , { "$set": data })
        result =  db["auth"].find_one({"account" : account})
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
        del data['account']
        del data['password']
        new_password['password'] = data['new_password']
        is_exist = db['auth'].update_one(email , { "$set": new_password })
        if is_exist.matched_count == 0:
            result["exist"] = False
        else:
            result["exist"] = True
        result['identity'] =  db["auth"].find_one({"account" : account})['identity']
        return result
        
            
    
    #get info from db    
    def get_info_from_db(self, email):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["info"].find_one({"email" : email})
        result['_id'] = str(result['_id'])
        result['birthday'] = result['birthday'].strftime("%Y/%m/%d")
        return json.dumps(result)


    
    # modify shift from db
    def modify_shift_from_db(self, data):
        info = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        info['_id'] = ObjectId(data['_id'])
        del data['_id']
        result = db['shift'].update_one(info, { "$set": data })
        return result
    
    # del shft from db
    def del_shift_from_db(self, data):
        info = dict()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        if db['shift'].find_one(data) != None:
            result = db['shift'].delete_one(data)
            return result
        else:
            return "notExist"

    #get shift from db    
    def get_shift_from_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = list(db["shift"].find({"route" : data['route'], "day" : data['day']}))
        
        for info in result:
            info['start_time'] = info['start_time'].strftime("%H:%M")
            info['_id'] = str(info['_id'])
            info['arrive_time'] = info['arrive_time'].strftime("%H:%M")
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

        return json.dumps({'inserted_id': str(result.inserted_id)})


    def get_info_from_db_all(self):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["auth"]
        
        tempList=[] # 用來存放account和identity的list
        all_account = list(result.find({})) # 原本含有pwd的list
        for i in range(0,len(all_account)):
            tempDictionary = all_account[i]
            tempDictionary.pop('_id')
            tempDictionary.pop('password')
            tempList.append(tempDictionary)
        
        return tempList
    
    #get driver from db    
    def get_driver_from_db(self, data):
        name = list()
        date = data["day"]
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        result = list(db["auth"].find({"identity" : 1},{ "_id": 0 , "password": 0, "identity": 0 }))
        for mail in result:
            name.append(db["info"].find_one({"email" : mail['account']},{"_id" : 0, "name": 1 })['name'])
        for i in range(0,len(name)-1):
            count = db["shift"].find({"day" : date, "driver" : name[i]}).count()
            if count >= 8:
                name.pop(i)
        return name
    
    
    

    #get driver from db    
    def get_modify_driver_from_db(self, data):
        name = list()
        date = data["day"]
        driver = data["driver"]
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        result = list(db["auth"].find({"identity" : 1},{ "_id": 0 , "password": 0, "identity": 0 }))
        for mail in result:
            name.append(db["info"].find_one({"email" : mail['account']},{"_id" : 0, "name": 1 })['name'])
        for i in range(0,len(name)-1):
            count = db["shift"].find({"day" : date, "driver" : name[i]}).count()
            #print(count)
            if name[i] == driver:
                name[0],name[i] = name[i], name[0]
            if count >= 8 and name[i] != driver:
                name.pop(i)
        return name

    # auth
    def authentication(self, account, password):
        client = pymongo.MongoClient('mongodb://'+self._config['mongodb']['User']+':'+self._config['mongodb']['Password']+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        result = list(db['auth'].find({'account' : account}))
        if len(result) > 0:
            if result[0]['password'] == password:
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
        coor_result = db['busRoad_coor'].insert_many(data_coor)
        coor_result = db[str(datetime.now())+'_busRoad_coor'].insert_many(data_coor)
        coor_result = db['route'].insert_many(data_route)
        coor_result = db[str(datetime.now())+'_route'].insert_many(data_route)
        return coor_result

    #get route from db    
    def get_route_from_db(self, bus_route):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        route_name = bus_route["route"]
        route_result = db["route"].find_one({'bus_route' : route_name})
        for i in range(1,len(route_result)-1):
            bus_stop=route_result[str(i)]
            position.append(db["busRoad_coor"].find_one({"route" : bus_stop},{"_id" : 0, "route": 1, "lat": 1, "lng": 1 }))
        return position

    #get busGPS from db (拿車子GPS)       
    def get_busGPS_from_db(self, bus_route):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        route_name = bus_route["route"]
        for x in mycol.find({"route" : route_name}, {"_id" : 0, "route": 1, "driver": 1, "lat": 1, "lng": 1, "peoplenum": 1}):
            print(x)
            position.append(x)
        return position
        
    def get_busGPS_from_db_web(self,driver):
        position = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        for x in mycol.find({"driver" : driver}, {"_id" : 0, "route": 1, "driver": 1, "lat": 1, "lng": 1}):
            position.append(x)
        return position
    def get_busDriver_from_db_web(self):
        driver = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        mycol = db['shift']
        all_driver = list(mycol.find({})) # 原本含有pwd的list
        for i in range(0,len(all_driver)):
            x = all_driver[i]
            x.pop('_id')
            x.pop('day')
            x.pop('start_time')
            x.pop('arrive_time')
            x.pop('peoplenum')
            if x['lat'] != 0.0 and x['lng']!=0.0:
                driver.append(x)
        
        return driver
    #set busGPS to db  (存GPS到DB)  
    def set_busGPS_into_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #把時間姓名進去找 符合存進去 //判斷是否符合
        day = data["day"]
        time = data["start_time"]
        name = data["email"]
        lat = data["lat"]
        lng = data["lng"]
        if 'peoplenum' in data.keys():
            peoplenum = int(data["peoplenum"])
        if lat is " ":
            flat = lat
            flng = lng
        else:
            flat = float(lat)
            flng = float(lng)
    
        driver_name = db["info"].find_one({'email' : name}, {"_id" : 0, "name": 1})
        driver = driver_name["name"]
        #時間還沒都進去 不知道格式 **
        if 'peoplenum' in data.keys():
            db["shift"].update_one({"driver" : driver, "day" : day, 'start_time' : time}, {"$set": { "lat": flat, "lng": flng, "peoplenum": peoplenum}})
            history_info = db["history"].find_one({'Driver' : driver, 'Start_time' : time, "Bus_shift" : 0}, {"_id" : 0, "onBus" : 1})
            total = 0
            on = []
            on = history_info['onBus']
            for i in range(0,len(on)-1):
                total = total + on[i]
            print("total")
            print(total)
            db["history"].update_one({'Driver' : driver, "Start_time" : time, "Bus_shift" : 0}, {"$set": { "Bus_shift" : 1, "totalNumOfPassengers" : total}})
        else:
            db["shift"].update_one({"driver" : driver, "day" : day, 'start_time' : time}, {"$set": { "lat": flat, "lng": flng}}) 
        position = "good"
        return position

    #get busNumber from db 
    def get_busNumber_from_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        result = list(db["route"].find({},{"_id" : 0, "bus_route": 1}))
        return json.dumps(result)
		
    def buspeople_to_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        day = data["day"]
        driver_name = db["info"].find_one({'email' : data['driver']}, {"_id" : 0, "name": 1})
        driver = driver_name["name"]
        db['shift'].update_one({"driver":driver, "day":day},{"$set": { "peoplenum": data['peoplenum']}})
        result =  db['shift'].find_one({"driver":driver, "day":day},{"_id" : 0, "peoplenum": 1})
        return result

    #set startBusStop   (剛開始拿站牌經緯度當司機GPS)
    def start_set_busStop_from_db(self, data):
        
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        day = data["day"]
        time = data["start_time"]
        email = data["email"]
        driver_info = db["info"].find_one({'email' : email}, {"_id" : 0, "name": 1})
        driver = driver_info["name"]
        driver_route = db["shift"].find_one({'driver' : driver, 'day' : day, 'start_time' : time}, {"route" : 1, "lat" : 1, "start_time" : 1})
        start_time = driver_route["start_time"]
        route = driver_route["route"]
        lat = driver_route["lat"]
        f_lat = float(lat)
        position = list()
        oil = 0
        R = 6373.0
        route_result = db["route"].find_one({'bus_route' : route})
        for i in range(1,len(route_result)-1):
            bus_stop=route_result[str(i)]
            position.append(db["busRoad_coor"].find_one({"route" : bus_stop},{"_id" : 0, "route": 1, "lat": 1, "lng": 1 }))
            if(i > 1):
                lat1 = radians(position[i-2]['lat'])
                lon1 = radians(position[i-2]['lng'])
                lat2 = radians(position[i-1]['lat'])
                lon2 = radians(position[i-1]['lng'])

                dlon = lon2 - lon1
                dlat = lat2 - lat1

                a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))
                distance = R * c
                oil = oil + distance
            
        print(oil)
        oil = oil * 30


        
        #增加一列到history
        newdata = {}
        newdata["Route"] = route
        newdata["Date"] = datetime.today()
        newdata["Bus_shift"] = 0 #前端表格再標就行了，後端應該不用存 #目前當車是否跑完的依據
        newdata["Driver"] = driver_info["name"]
        newdata["Start_time"] = start_time
        newdata["onBus"] = []
        newdata["offBus"] = []
        newdata["Arrival_time"] = []
        newdata["totalNumOfPassengers"] = 0
        newdata["FuelConsumption"] = oil
        newdata["surplus"] = 0
        print(newdata)
        result = db['history'].insert_one(newdata)

        return position

    #set busStop   (跑到一半拿站牌經緯度當司機GPS)
    def set_busStop_from_db(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #把時間姓名進去找 符合存進去 //判斷是否符合
        day = data["day"]
        time = data["start_time"]
        name = data["email"]
        driver_info = db["info"].find_one({'email' : name}, {"_id" : 0, "name": 1})
        driver = driver_info["name"]
       
        driver_route = db["shift"].find_one({'driver' : driver, 'day' : day, 'start_time' : time}, {"_id" : 0,"route" : 1, "lat" : 1})
        
        route = driver_route["route"]
        lat = float(driver_route["lat"])
        position = list()
        route_result = db["route"].find_one({'bus_route' : route})
  
        
        for i in range(1,len(route_result)-1):
            bus_stop=route_result[str(i)]
            position.append(db["busRoad_coor"].find_one({"route" : bus_stop},{"_id" : 0, "route": 1, "lat": 1, "lng": 1 }))
       
        fuck = dict()  
        fuck['fuck'] = "fuck"
        if abs(lat - 0) < 1.0e-9:
            start = "haveNotStart"
            return start
        else:
            for i in range(0,len(route_result)-2):
                if abs(float(position[0]["lat"])-lat) < 1.0e-9:
                    position.pop(0)
                    return position
                else:
                    position.pop(0)
            return fuck

    #回傳上下車跟到站時間
    def set_on_bus_off_bus(self, data):
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        now = datetime.today()
        db = client['KeelungBusSystem']
        print(data)
        time = data["start_time"]
        email = data["email"]
        onbus = data["onbus"]
        offbus = data["offbus"]
        arrivaltime = data["arrivaltime"]
        driver_info = db["info"].find_one({'email' : email}, {"_id" : 0, "name": 1})
        driver = driver_info["name"]
        history_info = db["history"].find_one({'Driver' : driver, 'Start_time' : time, "Bus_shift" : 0}, {"_id" : 0, "onBus" : 1, "offBus" : 1, "Arrival_time": 1})
        #把陣列取出 存值 再update
        print("history_info")
        print(history_info)
        on = []
        off = []
        arri = []
        on = history_info['onBus']
        off = history_info['offBus']
        arri = history_info['Arrival_time']
        on.append(onbus)
        off.append(offbus)
        arri.append(arrivaltime)
        print(off)
        db["history"].update_one({'Driver' : driver, 'Start_time' : time, "Bus_shift" : 0}, {"$set": { "onBus": on, "offBus": off, "Arrival_time": arri }})
        position = {"state" : "good"}
        return position

    def get_driver_state_from_db(self, data):
        driver_name = list()
        driver_state = list()
        work_time = 0
        temp_state = 1
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        day = str(data["day"])
        #找所有司機mail
        for x in db["auth"].find({'identity' : 1,'user': {'$regex': data['keyword']}}, {"_id" : 0, "user" : 1}):
            driver_name.append(x)
        
        for i in range(len(driver_name)):
            for y in db["shift"].find({"driver" : driver_name[i]["user"], "day" : day}, {"_id" : 0, "lat" : 1}):
                if y['lat'] != 0.0:
                    temp_state = 2
                    
                work_time = work_time + 1
            if work_time == 0:
                driver_dict = {
                    "driverName" : driver_name[i]["user"],
                    "workTime" : work_time,
                    "state" : 0 #休假
                }
            else: #開車和待命
                driver_dict = {
                    "driverName" : driver_name[i]["user"],
                    "workTime" : work_time,
                    "state" : temp_state #有排班
                }
            driver_state.append(driver_dict)
            
            work_time = 0
            temp_state = 1
        return driver_state    
    
###################################芷婷###########################################################
    def get_driver_name_from_db(self, data):
        print("AAAaaaaaaaaaaaaaaaaaaaaaaaa")
        name = list()
        client = pymongo.MongoClient('mongodb://'+self._user+':'+self._password+'@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        name.append(db["info"].find_one({"email" : data['email']}))
        
        print(name)
        return name
########################################################################

