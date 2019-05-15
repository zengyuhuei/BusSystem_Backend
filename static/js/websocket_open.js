
function websocket_init() 
{
    // Connect to Web Socket
    var i = 0;
    ws = new WebSocket("ws://140.121.198.84:9001/");
    // Set event handlers.
    ws.onopen = function() 
    {
      ws.send('A:'+localStorage.getItem('account'));
    };
    
    ws.onmessage = function(e) {
      // e.data contains received string.
      var from = new Array(); 
      from = String(e.data).split(" ",2);
      console.log(from[0])
      if(from[0]!="C")
        from = from[1].split("於",2);
      console.log(from);
      if(from[0]=="司機")
      {
        var ans = prompt(e.data,"回傳");
        sendMessageToDriver(" 管理員:"+ans);
      }
      else
      {
        alert(from[1]);
      }
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
function sendMessageToDriver(x)
{
  x = "C"+x;
  ws.send(x);
}
function start(account)
{
  localStorage.setItem('account',account)
  websocket_init();
  setDriver();
}
