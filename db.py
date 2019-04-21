import configparser
import os
import json
from pymongo import MongoClient
from config.Config import Config as config


class DB:
    def __init__(self):
        con = config()
        self._db_host = con.get_db("database", "db_host")
        self._db_port = con.get_db("database", "db_port")
        self._db_auth = con.get_db("database", "db_auth")
        self._db_user = con.get_db("database", "db_user")
        self._db_password = con.get_db("database", "db_password")
        self._client = None

    def connect(self):
        self._client = MongoClient("mongodb://"+self._db_user+":"+self._db_password+"@"+self._db_host+":"+self._db_port+"")
        return self._client

    def disconnect(self):
        self._client.close()