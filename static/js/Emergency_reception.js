
var i = 0;
var xString = ""
var driverList = new Array();
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
      var myLatLng = {lat:parseFloat(localStorage.getItem('lat')),lng:parseFloat(localStorage.getItem('lng'))};
      if(myLatLng['lat'] != 0.0 && myLatLng['lng'] != 0.0)
      {
         marker = new google.maps.Marker({
					position: myLatLng,
          map: map,
          icon:'../static/picture/FotoJet.png'
				});     
      }
      var message = "發生事故<br>司機:"+localStorage.getItem("driver")+"<br>時間:<br>位於:<br>狀況:";
      var infowindow = new google.maps.InfoWindow({
        content: message
      });
      google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.open(marker.get('map'), marker);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close(marker.get('map'), marker);
      });
    }
    function deleteMarkers() //單個marker 將新增新的marker
    {
      marker.setMap(null);
    }
		