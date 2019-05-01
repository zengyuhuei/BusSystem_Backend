
function websocket_init() 
{
    // Connect to Web Socket
    var i = 0;
<<<<<<< HEAD
    localStorage.setItem('Account','yanqing0709');
=======
>>>>>>> 8e9ef0936ed349ddfcc3e168f4099e2e25bfb291
    ws = new WebSocket("ws://localhost:9001/");
    // Set event handlers.
    ws.onopen = function() 
    {
      ws.send('A:'+localStorage.getItem('account'));
    };
    
    ws.onmessage = function(e) {
      // e.data contains received string.
      alert(e.data);
    };
    
    ws.onclose = function() {
    };
}
function sendMessageToManager()
{
  text = document.getElementById("exampleFormControlTextarea1")
  x = "B:"+text.value
  ws.send(x)
  text.value = " "
}
function sendMessageToDriver()
{
  x = "C:已接收到!將會立即處理!"
  ws.send(x)
}
function start(account)
{
  localStorage.setItem('account',account)
  websocket_init();
}