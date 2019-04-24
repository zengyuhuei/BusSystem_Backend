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
    if x[0] is 'A':
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
                    
    else:
        clientList = server._get_client()
        for client in clientList:
            if client['identity'] is 'manager':
                print("AAA\n")
                server.send_message(client,x[1])
        
   
    
PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()

# b = a[i:j]   表示复制a[i]到a[j-1]，以生成新的list对象
