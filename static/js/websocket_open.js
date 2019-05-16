
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
      console.log(e.data)
      from = String(e.data).split(":",1);
      console.log(from[0])
      console.log("CCC");
      if(from[0]=="B")
      {
        var ans = prompt(e.data,"回傳");
        returnMessageToDriver(" 管理員:"+ans);
      }
      else if(from[0] == "C")
      {
        alert(e.data);
      }
      else if(from[0] == "D")
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
function returnMessageToDriver(x)
{
  x = "C:"+x;
  ws.send(x);
}
function sendMessageToDriver()
{
  text = document.getElementById("exampleFormControlTextarea1")
  driverName = $("#driverName").val()
  var driver = new Array()
  console.log(driverName)
  var driver = driverName.split(" ",2)
  console.log(driver[1])
  x = "D:Manager send message to "+driver[1] + ":"+ text.value
  console.log(x);
  ws.send(x);
  text.value = " "
}
function start(account)
{
  localStorage.setItem('account',account)
  websocket_init();
}
