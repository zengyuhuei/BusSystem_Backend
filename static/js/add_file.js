function setData(xString)
{
 document.getElementById("shift").innerHTML += '<select class="form-control" id="inputRoute">'+xString+'</select>';
}

function starts()
{
 var optionString = '';
 var i = 0;
 const p = new Promise(
  (resolve,reject)=>{$.ajax({
   type: 'POST',
   dataType : 'json',
   contentType : 'application/json',
   url: "http://127.0.0.1:3000/getbusNumber",
   data:JSON.stringify({
    
   }),
    error: function (xhr) { },      // 錯誤後執行的函數
    success: function (response) {
    while(response[i]!=null)
    {
     optionString +='<Option>'+response[i]["bus_route"]+'</Option>';
     i++;
    }
    //x.html(optionString);
   }// 成功後要執行的函數
  }).done(result => resolve(optionString))
 }).then(result => setData(optionString));

}