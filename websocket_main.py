from websocket_server import WebsocketServer

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
    if x[0] == 'A':
        print("Client(%d) send ID: %s" % (client['id'], message))
        
        # Whenever message received, server send message to client2
        clientList = server._get_client()
        #new = clientList[1]
        #server.send_message(new, "Server said: Hi, Client2")
        
        accountList = server._get_account()
        print("Initial account list:")
        print(accountList)
        print("\n")
    
        print("Initial client list:")
        print(clientList)
        print("\n")
        
        for i in accountList:
            if x[1] == i['account']:
                print("Find account successfully, identity: %s\n" % (i['identity']))
                
                clientList[client['id']-1]['accountName'] = message
                clientList[client['id']-1]['identity'] = i['identity']
        
        print("Afterwards client list:")
        print(clientList)
        print("\n")
                    
    elif x[0] == 'B':
        print("Client(%d) send message: %s" % (client['id'], message))
        
        global client_sender_id
        client_sender_id = client['id']
        print("B:Client(%d) 傳訊給管理者" % (client_sender_id))
        # 推播訊息給管理者，不管身分只要send就是指有管理噁能看到訊息
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] == 'manager':
                server.send_message(client,x[1])
    else:    
        #管理者回傳訊息給司機
        #server.send_message(client['id'],"朕知道了")
        clientList = server._get_client()
        
        print("C:Client(%d) 傳訊給管理者" % (client_sender_id))
        server.send_message(clientList[client_sender_id-1], "朕知道了")
        print(clientList[client_sender_id-1])
        #print("Client(%d) sendback message: %s" % (client['id'], "朕知道了")) 
        
   
    
PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()

# b = a[i:j]   表示复制a[i]到a[j-1]，以生成新的list对象
