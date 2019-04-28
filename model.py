from pymongo import MongoClient
import pymongo
import json
import time
from datetime import datetime
from bson import ObjectId
        
class Model:
        
    # add_driver_to_db
    def add_driver_to_db(self, data, acc_data):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        info_result = db['info'].insert_one(data)
        account_result = db['auth'].insert_one(acc_data)
        print(info_result)
        print(account_result)
        return info_result

     # modify info
    def modify_info_to_db(self, data):
        email = dict()
        
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        email['email'] = data['email']
        print(email)
        del data['email']
        print(data)
        result = db['info'].update_one(email , { "$set": data })
        #result['identify'] = 
        return result
    
    #get info from db    
    def get_info_from_db(self, email):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
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
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        info['route'] = data['route']
        info['day'] = data['day']
        print(info)
        del data['route']
        del data['day']
        print(data)
        result = db['shift'].update_one(info, { "$set": data })
        return result
    
    # del shft from db
    def del_shift_from_db(self, data):
        info = dict()
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        
        print(data)
        result = db['shift'].delete_one(data)
        return result

    #get shift from db    
    def get_shift_from_db(self, data):
        print("AA")
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["shift"].find_one({"route" : data['route'], "day" : data['day']})
        print(result)
        result['start_time'] = result['start_time'].strftime("%H:%M")
        del result['_id']
        return json.dumps(result)

    # add_shift_to_db
    def add_shift_to_db(self, data):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        print(data)
        result = db['shift'].insert_one(data)
        print(result)
        return result


    def get_info_from_db_all(self):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
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
        return tempList

    # auth
    def authentication(self, account, password):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        print(account, password)
        result = list(db['auth'].find({'account' : account}))
        if len(result) > 0:
            if result[0]['password'] == password:
                print(result[0])
                return result[0]
        return False




