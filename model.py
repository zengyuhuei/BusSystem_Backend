from pymongo import MongoClient
import pymongo
import json
import time
from datetime import datetime
from bson import ObjectId
        
class Model:
        
    # add_info_to_db
    def add_one_to_db(self, data):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client["KeelungBusSystem"]
        # data = { a : xxxx, b : 12345 }
        result = db['info'].insert_one(data)
        print(result)
        return result
    
    #get info from db    
    def get_info_from_db(self, email):
        print(email)
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        print("aa")
        result = db["info"].find_one({"email" : email})
        print(result)
        result['_id'] = str(result['_id'])
        result['birthday'] = result['birthday'].strftime("%Y/%m/%d")
        return json.dumps(result)

    def get_info_from_db_all(self):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["account"]
        all_account = list(result.find({}))
        print()
        return all_account

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




