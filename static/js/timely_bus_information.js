var map;
var intervalControl;
var directionsService;
var directionsDisplay;
var jj=[];
var marker1 = [];
var markers = [];

$(document).ready(function(){
	$("#yes").click(function() {
		$("#map").show();
		$("#bus").show();
		$route = $("#inputRoute").val();
		load($route);
		busGPS($route);
		document.getElementById("driver").innerHTML = "<td></td>";
		document.getElementById("passenger").innerHTML = "<td></td>";
	})
	$(".manager_name").html(localStorage.getItem("name"));
	// 初始化地圖
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 21,
		center: new google.maps.LatLng(25.143411, 121.774429),
		});
	// 載入路線服務與路線顯示圖層
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers: true // 單純畫路線，不要顯示 marker
	});



	// 放置路線圖層
	directionsDisplay.setMap(map);
	intervalControl = setInterval(function(){
		let route = $("#inputRoute").val();
		if(route){
			busGPS(route);
		}
	},5000);
});

function load(route){
	$.ajax({
		type: "POST",
		data: "json",
		dataType: "json",
		contentType : 'application/json',
		url: "http://140.121.198.84:3000/getRoute",
		data:JSON.stringify({
			"route": route
		}),
		success: function(response) {
			console.log(response);
			returnRoute(response);
		},
		error: function(xhr, type) {
			console.log("ouo");
		}
	});
}



function busGPS(route){
	$.ajax({
		type: "POST",
		data: "json",
		dataType: "json",
		contentType : 'application/json',
		url: "http://140.121.198.84:3000/getbusGPS",
		data:JSON.stringify({
			"route": route
		}),
		success: function(response) {
			console.log(response);
			jj = returnGPS(response);
			busInformation();
		},
		error: function(xhr, type) {
			console.log("hehehe");
		}
	});

	//setTimeout("busGPS($route)",5000);
}

function returnGPS(bus_coor)
{
	var coor = Object.keys(bus_coor).map(function(_) { return bus_coor[_]; });
	console.log(coor.length);
	return coor;
}

function returnRoute(json)
{
	var obj = Object.keys(json).map(function(_) { return json[_]; });
	console.log(obj);
	console.log(obj.length);
	/*var bus_coor = [
		{lat: 25.135139, lng: 121.782333},
		{lat: 25.139583, lng: 121.789444},
		{lat: 25.135306, lng: 121.784750},
		{lat: 25.142389, lng: 121.789306}
	]*/
	
	//var jj = returnGPS(bus_coor);
	console.log(jj);
	
	var waypts = [];
	for(var j = 0; j < markers.length ; j++){
		console.log("set bus stop marker null");
		markers[j].setPosition(null);
		markers[j].setMap(null);
		markers[j]=null;
	}
	markers = [];
	
	
	for (var i = 1; i < obj.length-1; i++) {
		waypts.push({
			location: obj[i],
			stopover: false
		});
	}

	var point = {
		origin: obj[0],
		destination: obj[obj.length-1],
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}

	directionsService.route( point, function(response, status) {
		if (status == 'OK') {
			// 回傳路線上每個步驟的細節
			for(var i = 0; i < obj.length; i++)
			{
				// 加入地圖標記
				markers[i] = new google.maps.Marker({
					position: obj[i],
					map: map,
					label: { text: ''+i, color: "#fff" },
					data: obj[i].route,
					data2: "https://www.google.com.tw/", //影像連結 一起從json拿出
					zIndex:1
				});
				// 加入資訊視窗
				var infowindow = new google.maps.InfoWindow();
				//infowindows[i].open(map, markers[i]);

				// 加入地圖標記點擊事件
				markers[i].addListener('click', function () {
						console.log("ouo");		
						infowindow.setContent( this.data +'<br><a href='+ this.data2 +' target="_blank">查看即時影像</a>');
						infowindow.open(map, this);
				});
				
			}

		directionsDisplay.setDirections(response);
		} else {
		console.log(status);
		}
	});


}

function busInformation()
{
    for(var j = 0; j < marker1.length ; j++){
		console.log("set bus marker null");
		marker1[j].setPosition(null);
		marker1[j].setMap(null);
		marker1[j]=null;
	}
	marker1 = [];
	//公車資訊
	for(var j = 0; j < jj.length ; j++){
		marker1[j] = new google.maps.Marker({
			position: jj[j],
			map: map,
			icon:'https://i.ibb.co/s6B8nGn/bb.png',
			data:jj[j].driver,
			data2:jj[j].peoplenum,
			zIndex:2
		});
		// 加入地圖標記點擊事件
		marker1[j].addListener('click', function () {
			console.log("bus clicked!");
			document.getElementById("driver").innerHTML = "<td>"+this.data+"</td>";
			document.getElementById("passenger").innerHTML = "<td>"+this.data2+"</td>";
		});
	}
}


