
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
		let route = $("#inputRoute").val();
		let time = $("#date").val();
		
		load(route);
		console.log(route);
		console.log(time);
		createTable(route,time);
	})

	// 初始化地圖
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 23,
		center: new google.maps.LatLng(25.143411, 121.774429),
		});
	// 載入路線服務與路線顯示圖層
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers: true // 單純畫路線，不要顯示 marker
	});



	// 放置路線圖層
	directionsDisplay.setMap(map);
	$(".manager_name").html(localStorage.getItem("name"));
	$('#birthday').datetimepicker({
		format: 'YYYY/MM/DD'
	});
});
function load(route){
	$.ajax({
		type: "POST",
		data: "json",
		dataType: "json",
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/getRoute",
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
function setData(xString)
{
	document.getElementById("inputState").innerHTML += '<select class="form-control" id="inputRoute">'+xString+'</select>';
}

function createTable(route,time)
{
	var i = 0;
	$.ajax({
	type: 'POST',
	dataType : 'json',
	contentType : 'application/json',
	url: "http://127.0.0.1:3000/getHistory",
	data:JSON.stringify({
		"route":route,
		"time": time
	}),
		error: function (xhr) { 
		},      // 錯誤後執行的函數
		success: function (response) {
		while(response[i]!=null)
		{
			$('[data-toggle="tooltip"]').tooltip();
			var actions = $("table td:last-child").html();
			var index = $("table tbody tr:last-child").index();
			var row = '<tr>' +
					'<td>'+(i+1)+'</td>'+
					'<td>'+response[i]['Start_time']+'</td>' +
					'<td>'+response[i]['Driver']+'</td>' +
					'<td>'+response[i]['totalNumOfPassengers']+'</td>'+
					'<td>'+response[i]['FuelConsumption']+'</td>'+
					'<td>'+response[i]['surplus']+'</td>'+
					'</tr>';
					$("table").append(row);				
			i=i+1;
		}		
	}// 成功後要執行的函數
})
}
function start_his()
{
	var xString = '';
	var i = 0;
	const p =new Promise(
		(resolve,reject)=>{	$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/getbusNumber",
			data:JSON.stringify({
				
			}),
				error: function (xhr) { 
				},      // 錯誤後執行的函數
				success: function (response) {
				console.log("下拉式選單: "+response);
				while(response[i]!=null)
				{
					xString +='<Option>'+response[i]["bus_route"]+'</Option>';
					console.log("下拉式選單: "+response[i]["bus_route"]);
					i++;
				}					//x.html(optionString);
			}// 成功後要執行的函數
		}).done(result => resolve(xString))
	}).then(result => setData(xString))
	websocket_init();
}

