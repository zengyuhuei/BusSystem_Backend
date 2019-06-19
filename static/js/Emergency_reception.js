
var i = 0;
var xString = ""
var driverList = new Array();
var marker1 = [];
var marker;
$(document).ready(function(){
	$(".manager_name").html(localStorage.getItem("name"));
});
function setData()
{
    document.getElementById("busdriver").innerHTML += '<select class="form-control" id="driverName">'+xString+'</select>';
}
function setDriver()
{
    const p =new Promise(
		(resolve,reject)=>{
    $.ajax({
        type: 'POST',
        url: "http://140.121.198.84:3000/getbusDriverforWeb",
        data:'json',
        dataType:'json',
        contentType:'json',
          error: function (xhr) { },      // 錯誤後執行的函數
          success: function (response) {
            console.log(response);
            while(response[i]!=null)
            {
                xString +='<Option>'+response[i]["route"]+" "+response[i]["driver"]+'</Option>';
                console.log("下拉式選單: "+response[i]["route"]+" "+response[i]["driver"]);
                i++;
            }
        }// 成功後要執行的函數
      }).done(result => resolve(xString))
    }).then(result => setData(xString))
    .then(result=>initialize())
    .then(result=> websocket_init());
}


    function initialize() {
      $.ajax({
        type: 'POST',
        url: "http://140.121.198.84:3000/getbusDriverforWeb",
        data:'json',
        dataType:'json',
        contentType:'json',
          error: function (xhr) { },      // 錯誤後執行的函數
          success: function (response) {
            console.log(response);
            while(response[i]!=null)
            {
                xString +='<Option>'+response[i]["route"]+" "+response[i]["driver"]+'</Option>';
                console.log("下拉式選單: "+response[i]["route"]+" "+response[i]["driver"]);
                i++;
            }
        }// 成功後要執行的函數
      })
      var mapOptions = {
        center: { lat:25.143411,lng:121.774429}, 
        zoom: 14
      };
      var map = new google.maps.Map(
          document.getElementById('map'),
          mapOptions);
      $.ajax({
        type: 'POST',
        url: "http://140.121.198.84:3000/getDriverState",
        data:'json',
        dataType:'json',
        contentType:'json',
          error: function (xhr) { },      // 錯誤後執行的函數
          success: function (response) {
            console.log(response)
            marker1 = response
            for(var j = 0; j < marker1.length ; j++){
              console.log(marker1[j]['driver'])
              var now = localStorage.getItem(marker1[j]['driver'])
              var message = "發生事故<br>司機:"+marker1[j]['driver']+"<br>時間:"+marker1[j]["arrive_time"]+"<br>狀況:"+now;
              console.log(marker1[j])
              console.log(message)
              var myLatLng = {lat:parseFloat(marker1[j]['lat']),lng:parseFloat(marker1[j]['lng'])};
              marker1[j] = new google.maps.Marker({
                position:myLatLng,
                map: map,
                icon:'../static/picture/FotoJet.png'
              });
              var infowindow = new google.maps.InfoWindow();
              marker1[j].addListener('click', function () {	
                infowindow.setContent(message);
                infowindow.open(map, this);
              });
              /*google.maps.event.addListener(marker1[j], 'mouseover', function() {
                infowindow.open(marker.get('map'), marker1[j]);
              });
              google.maps.event.addListener(marker1[j], 'mouseout', function() {
                infowindow.close(marker1[j].get('map'), marker1[j]);
              });*/
            }
        }// 成功後要執行的函數
      })
          
      
    }
    function deleteMarkers() //單個marker 將新增新的marker
    {
      initialize();
    }
		