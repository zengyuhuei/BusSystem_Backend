
var i = 0;
var xString = ""
var driverList = new Array();
var marker1 = [];
var marker2 = [];
var message = [];
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
            marker2 = response
            var i = 0
            for(var j = 0; j < marker2.length ; j++)
            {
              var myLatLng = {lat:parseFloat(marker2[j]['lat']),lng:parseFloat(marker2[j]['lng'])};
              marker1[j] = new google.maps.Marker({
                position:myLatLng,
                map: map,
                icon:'../static/picture/FotoJet.png',
                id:j
              });
              
              message[j] = "發生事故<br>司機:"+marker2[j]['driver']+"<br>時間:"+marker2[j]['arrive_time']+"<br>狀況:"+localStorage.getItem(marker2[j]['driver']);

              console.log(marker2[j]['driver'])
              var infowindow = new google.maps.InfoWindow();
              console.log(marker1[j])
              marker1[j].addListener('click', function () {	
                infowindow.setContent(message[marker1[this.id].id]);
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
		