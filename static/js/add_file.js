function setData(xString)
{
 document.getElementById("shift").innerHTML += '<select class="form-control" id="inputRoute">'+xString+'</select>';
}

function starts()
{
 console.log("DDDDDD");
 var optionString = '';
 var i = 0;
 const p = new Promise(
  (resolve,reject)=>{$.ajax({
   type: 'POST',
   dataType : 'json',
   contentType : 'application/json',
   url: "http://140.121.198.84:3000/getbusNumber",
   data:JSON.stringify({
    
   }),
    error: function (xhr) { },      // 錯誤後執行的函數
    success: function (response) {
    console.log("下拉式選單: "+response);
    while(response[i]!=null)
    {
     optionString +='<Option>'+response[i]["bus_route"]+'</Option>';
     console.log("下拉式選單: "+response[i]["bus_route"]);
     i++;
    }
    //x.html(optionString);
   }// 成功後要執行的函數
  }).done(result => resolve(optionString))
 }).then(result => setData(optionString))
 .then(result => setInterval(function(){repeat(),5000}));

}