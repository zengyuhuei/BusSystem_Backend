from websocket_server import WebsocketServer
from model import Model
model = Model()
client_sender_id = list()
sayHello_to_driver_List = list()
# Called for every client connecting
def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])
    #server.send_message_to_all("Hey all, a new client has joined us")

# Called for every client disconnecting
def client_left(client, server):
	print("Client(%d) disconnected" % client['id'])

# Called when a client sends a message
def message_received(client, server, message):
    if len(message) > 200:
        message = message[0:200]+'..'
    x=message.split(":",1)
    print(x)
    if x[0] == 'A':  #登入用      
        # Whenever message received, server send message to client2
        clientList = server._get_client()
        #new = clientList[1]
        #server.send_message(new, "Server said: Hi, Client2")        
        accountList = server._get_account()
        #print("Initial account list:")
        #print(accountList)
        #print("\n")
    
        print("Initial client list:")
        print(clientList)
        print("\n")
        
        for i in accountList:
            print(x[1])
            if x[1] == i['account']:
                print("Find account successfully, identity: %s\n" % (i['identity']))
                
                clientList[client['id']-1]['accountName'] = message
                clientList[client['id']-1]['identity'] = i['identity']
                clientList[client['id']-1]['user'] = i['user']
        
        print("Afterwards client list:")
        print(clientList)
        print("\n")
                    
    elif x[0] == 'B': #登入完成後，司機傳訊息給管理者用
        print("(%s) send message: %s" % (client['user'], message))
        username = client['user']
        name = client['accountName'].split(":",1)
        print(name[1])
        nowposition = model.get_busGPS_from_db_web(client['user'])
        z = " "
        print(nowposition)
        for now in nowposition:
            print(now)
            z = now
        print(z)
        lat = str(z['lat'])
        lng = str(z['lng'])
        
        print("before")
        print(client_sender_id)
        client_sender_id.append(client['user'])

        # 推播訊息給管理者，不管身分只要send就是指有管理者能看到訊息
        print("after")
        print(client_sender_id)
        
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] == 0:
                server.send_message(client,"B:"+username+" 司機於:\nlat:"+lat+"\nlng:"+lng+"\n發生意外:\n"+x[1])
        #print(client_sender_id)
        
    elif x[0] == 'C': #管理者回覆訊息給司機
        #server.send_message(client['id'],"朕知道了")
        clientList = server._get_client()
        check = 0
        for cli in clientList:
            if cli['user'] == client_sender_id[0]:
                server.send_message(cli, message)
                check = 1
        if  check == 0:#假設websocket server查詢不到此司機 將會將此司機放置欲回傳Listㄉ最後一ㄍ位置
            client_sender_id.append(cli)
        else            
            client_sender_id.pop(0)
        print("印出clientList")
        print(clientList)
        
        #print("印出回覆對象的詳細資料")
        #print(clientList[client_sender_id[0]-1])
        
        print("管理者尚未回覆的司機清單client_sender_id")
        print(client_sender_id)
        #print("Client(%d) sendback message: %s" % (client['id'], "朕知道了")) 
        
    elif x[0] == 'D': #管理員主動傳訊息給司機x[0] == 'D'
        #處理x[1]的訊息，取出司機名稱的字串出來比較，相符才能傳訊息
        #print(x[1])
        driverName = x[1][24:27]
        print(driverName)
        y = x[1].split(":",1)
        # 記得管理者的名字跟id
        manager_id = client['id']
        
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] == 1:
                driver = {
                        'driver_id': client['id'],
                        'driver_name': client['user']
                }
                sayHello_to_driver_List.append(driver)
                print(client)
                print(sayHello_to_driver_List)
        
        
        for driver in sayHello_to_driver_List:
            if driver['driver_name'] == driverName:
                print(driver)
                print("D:管理者Client(%s) 主動跟 司機Client(%s) 傳訊息" % (manager_id, driver['driver_id']))
                server.send_message(clientList[driver['driver_id']-1], "D:管理者發出緊急通知!\n"+y[1])
        sayHello_to_driver_List.clear()
    elif x[0] == 'E': #D的回傳 x[0] = E
        driverNameE = client['user']
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] == 0:
                server.send_message(client,"E:"+driverNameE+" 司機已接到訊息!")
    elif x[0] == 'F': #狀況排除
        print("S")
        driverNameE = client['user']
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] == 0:
                server.send_message(client,"F:"+driverNameE+" 狀況已排除!")
        
        

        



PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()

# b = a[i:j]   表示复制a[i]到a[j-1]，以生成新的list对象
