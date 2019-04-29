$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").toggle();
		$("#bus").toggle();
		$route = $("#inputRoute").val();
		load($route);
		getTable();
	})
});
function setTable(response)
{
	var i = 0;
	while(response[i]!=null)
	{
		console.log(response[i]);
		$('[data-toggle="tooltip"]').tooltip();
		var actions = $("table td:last-child").html();
		var index = $("table tbody tr:last-child").index();
		var row = '<tr>' +
				'<td style="display: none;">'+response[i]['_id']+'</td>' +
				'<td>'+(i+1)+'</td>'+
				'<td>'+response[i]['start_time']+'</td>' +
				'<td>'+response[i]['driver']+'</td>' +
				'</tr>';
				$("table").append(row);				
		i=i+1;
	}	
	var row = '<tr>' +'<td>   </td>'+
				'<td>'+(i)+"個班次"+'</td>'+
				'<td>  </td>'+
				'</tr>';
				$("table").append(row);			
}
function getTable()
{
	console.log("AaAA");
	$route = $("#inputRoute").val();
	$day = $("#inputDate").val();
	var tr_length = $('.table tbody tr').length; 
	var Tbdata = {}; 
	for(var i=tr_length; i > 1; i--)
	{
		var td_length = $('.table tr')[i].childElementCount; //當下td長度
		$('.table tr:eq('+i+')').remove();
	}
	console.log($route+$day);
	// For Success/Failure Message
  	// Check for white space in name for Success/Fail message
	$.ajax({
		type: 'POST',
		data : 'json',
		dataType : 'json',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/getShift",
		data:JSON.stringify({
			"route":$route,
			"day": $day
		}),
		error: function (xhr) { },      // 錯誤後執行的函數
		success: function (response) {
			console.log(response);
			console.log("AAAA");
			setTable(response);
		}// 成功後要執行的函數
	});
}


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
			console.log(response[0]);
			returnRoute();
		},
		error: function(xhr, type) {
			console.log("ouo");
		}
	});
}

function returnRoute()
{
	var map;
	var json = [
		{name: "深美國小", lat: 25.136333, lng: 121.778361},
		{name: "深溪路口", lat: 25.135139, lng: 121.782333},
		{name: "海中天社區", lat: 25.135306, lng: 121.784750},
		{name: "巴塞隆納社區", lat: 25.135611, lng: 121.785639},
		{name: "碧海擎天社區", lat: 25.136333, lng: 121.787778},
		{name: "普羅旺世社區", lat: 25.137444, lng: 121.788667},
		{name: "八斗高中", lat: 25.139583, lng: 121.789444},
		{name: "福泉寺", lat: 25.142389, lng: 121.789306},
	]
	
	console.log(JSON.stringify(json));
	var obj = Object.keys(json).map(function(_) { return json[_]; });

	// 載入路線服務與路線顯示圖層
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer({
	suppressMarkers: true // 單純畫路線，不要顯示 marker
	});

	// 初始化地圖
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 17,
	center: obj[obj.length/2]
	});

	// 放置路線圖層
	directionsDisplay.setMap(map);
	var waypts = [];
	var markers = [];

	console.log(obj);
	console.log(obj.length);
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
					data: obj[i].name
					});
					// 加入資訊視窗
					var infowindow = new google.maps.InfoWindow();
					//infowindows[i].open(map, markers[i]);

					// 加入地圖標記點擊事件
					markers[i].addListener('click', function () {
							console.log("ouo");
							infowindow.setContent( this.data );
							infowindow.open(map, this);
					});

				}
			directionsDisplay.setDirections(response);
			} else {
			console.log(status);
			}
		});
		document.getElementById("yes").addEventListener("click", myFunction);
		function myFunction() {
			map.setZoom(15);
			map.setCenter(obj[obj.length/2]);
		}
}