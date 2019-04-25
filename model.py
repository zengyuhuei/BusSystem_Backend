from pymongo import MongoClient
import pymongo
import json
import time
from datetime import datetime
from bson.objectid import ObjectId
        
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
    def get_info_from_db(self, id):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["info"].find_one({"_id" : ObjectId(id)})
        result['_id'] = str(result['_id'])
        result['birthday'] = result['birthday'].strftime("%Y/%m/%d")
        print()
        """
        {
            "_id": "5cbd7f162af88f755a4390da",
            "name": "tseng",
            "gender": 0,
            "birthday": "2019/04/11",
            "phone_number": "0918338687",
            "email": "zengyuhuei@gmail.com",
            "identification_id": "F123456789",
            "account": "123456", "address":
            "ananaana",
            "picture": "file.jpg"}
        """
        return json.dumps(result)

    def get_info_from_db_all(self):
        client = pymongo.MongoClient('mongodb://user:870215@140.121.198.84:27017/')
        db = client['KeelungBusSystem']
        #collection = db['list']
        result = db["account"]
        all_account = list(result.find({}))
        print()
        """
        {
            "_id": "5cbd7f162af88f755a4390da",
            "name": "tseng",
            "gender": 0,
            "birthday": "2019/04/11",
            "phone_number": "0918338687",
            "email": "zengyuhuei@gmail.com",
            "identification_id": "F123456789",
            "account": "123456", "address":
            "ananaana",
            "picture": "file.jpg"}
        """
        return all_account




