
var i = 0;
var xString = ""
var driverList = new Array();
function setData()
{
    document.getElementById("busdriver").innerHTML += '<select class="form-control" id="inputRoute">'+xString+'</select>';
}
function setDriver()
{
    const p =new Promise(
		(resolve,reject)=>{
    $.ajax({
        type: 'POST',
        url: "http://140.121.198.84:3000/getbusDriverforWeb",
        data:formData,
        cache:false,
        processData:false,
        contentType:false,
          error: function (xhr) { },      // 錯誤後執行的函數
          success: function (response) {
            console.log(response);
            while(response[i]!=null)
            {
                xString +='<Option>'+response[i]["bus_route"]+'</Option>';
				console.log("下拉式選單: "+response[i]["bus_route"]);
				i++;
            }
        }// 成功後要執行的函數
      }).done(result => resolve(xString))
    }).then(result => setData(xString));
    websocket_init();
}