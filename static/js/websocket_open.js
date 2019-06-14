
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
      if(from[0]=="B")
      {
        var ans = prompt(e.data.slice(2),"回傳");
        returnMessageToDriver(" 管理員:"+ans);
        var x = e.data.split(/[:\n]/);
        
        var answer = confirm("是否要跳轉至突發接收頁面?") //把確認框賦值給answer
        if(answer) //判斷是否點選確定
          window.location ="http://140.121.198.84:3000/Emergency_reception" //確定的話遊覽器自身跳轉
      }
      else if(from[0] == "C")
      {
        alert(e.data.slice(2));
      }
      else if(from[0] == "D")
      {
        var ans = prompt(e.data.slice(2),"收到");
        returnMessageToManager(" 司機:"+ans);
      }
      else if(from[0] == "E")
      {
        alert(e.data.slice(2));
      }
      else if(from[0] == "F")
      {
        alert(e.data.slice(2));
        deleteMarkers()
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
  $.ajax({
    type: 'POST',
    data : 'json',
    contentType : 'application/json',
    url: "http://140.121.198.84:3000/updateDriverState",
    data:JSON.stringify({
      "driver":localStorage.getItem("name"),
      "state1":1,
      "state2":2
    }),
      error: function (xhr) { },      // 錯誤後執行的函數
      success: function (response) { }// 成功後要執行的函數
    });
}
function returnMessageToDriver(x)
{
  x = "C:"+x;
  ws.send(x);
}
function sendMessageToDriver()
{
  text = document.getElementById("exampleFormControlTextarea1");
  driverName = $("#driverName").val();
  var driver = new Array();
  var driver = driverName.split(" ",2);
  x = "D:Manager send message to "+driver[1] + ":"+ text.value;
  ws.send(x);
  text.value = " ";
}
function returnMessageToManager(x)
{
  x = "E:"+x;
  ws.send(x);
}
function solveEmergency()
{
  var x = "F:狀況已排除!";
  ws.send(x);
  $.ajax({
    type: 'POST',
    data : 'json',
    contentType : 'application/json',
    url: "http://140.121.198.84:3000/updateDriverState",
    data:JSON.stringify({
      "driver":localStorage.getItem("name"),
      "state1":2,
      "state2":1
    }),
      error: function (xhr) { },      // 錯誤後執行的函數
      success: function (response) {
    }// 成功後要執行的函數
    });
}
function start(account)
{
  localStorage.setItem('account',account);
  websocket_init();
  setName();
}

