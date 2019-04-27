
function websocket_init() 
{
    // Connect to Web Socket
    var i = 0;
    localStorage.setItem('account','{{account}}')
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
function sendMessage()
{
  text = document.getElementById("exampleFormControlTextarea1")
  ws.send(text.value)
}
function start(account)
{
  console.log(account);
  websocket_init();
}