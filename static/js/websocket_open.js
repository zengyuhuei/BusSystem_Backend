
function websocket_init() 
{
    // Connect to Web Socket
    var i = 0;
    localStorage.setItem('Account','yanqing0709');
    ws = new WebSocket("ws://localhost:9001/");
    // Set event handlers.
    ws.onopen = function() 
    {
      ws.send('A:'+localStorage.getItem('Account'))
    };
    
    ws.onmessage = function(e) {
      // e.data contains received string.
      alert(e.data);
    };
    
    ws.onclose = function() {
    };
}