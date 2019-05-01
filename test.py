# -*- coding: utf-8 -*-
"""
Created on Sat Apr 27 15:47:55 2019

@author: by938
"""

listTest = [{'account': 'zengyuhuei@gmail.com', 'password': '20170212', 'identity': 0}, {'account': 'admin@gmail.com', 'password': '12345', 'identity': 0}, {'account': 'ting@gmail.com', 'password': '20190423', 'identity': 1}]

tempList=[]

for i in range(0,len(listTest)):
    tempDictionary = listTest[i]
    tempDictionary.pop('password')
    tempList.append(tempDictionary)
    
print(tempList)
