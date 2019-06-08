var map;
var intervalControl;
var directionsService;
var directionsDisplay;
var jj = [];
var markers = [];
var historyRecord = [];



$(document).ready(function(){
	$("#yes").click(function() {
		$("#map").show();
		$("#bus").show();
		let route = $("#inputRoute").val();
		let time = $("#date").val();		
		load(route);
		console.log(route);
		console.log(time);
		var table = document.getElementById("busTable");
		if(table.rows!=null)
		{
			for(var i=table.rows.length - 1; i > 0; i--)
			{
				table.deleteRow(i);
			}
		}		
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
			var stopOnBusInfo = [];
			var stopOffBusInfo = [];
			var stopBusArrivalInfo = [];
			stopOnBusInfo = historyRecord[0].onBus;
			stopOffBusInfo = historyRecord[0].offBus;
			stopBusArrivalInfo = historyRecord[0].Arrival_time;
			for(var i = 0; i < obj.length; i++)
			{
				// 加入地圖標記
				markers[i] = new google.maps.Marker({
					position: obj[i],
					map: map,
					label: { text: ''+i, color: "#fff" },
					data: obj[i].route,
					data2: stopOnBusInfo[i],
					data3: stopOffBusInfo[i],
					data4: stopBusArrivalInfo[i],
					zIndex:1
				});
				// 加入資訊視窗
				var infowindow = new google.maps.InfoWindow();
				//infowindows[i].open(map, markers[i]);

				// 加入地圖標記點擊事件
				markers[i].addListener('click', function () {
						console.log("ouo");		
						infowindow.setContent( "<p>站牌名稱: " + this.data + "</p><p>上車人數: " + this.data2 + "</p><p>下車人數: " + this.data3 + "</p><p>到站時間: " + this.data4 + "</p>");
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
		console.log(response);
		historyRecord = response;
		while(response[i]!=null)
		{
			$('[data-toggle="tooltip"]').tooltip();
			var actions = $("table td:last-child").html();
			var index = $("table tbody tr:last-child").index();
			var row = '<tr  class=clickable-row>' +
					'<td align="center" valign="middle">'+(i+1)+'</td>'+
					'<td align="center" valign="middle">'+response[i]['Start_time']+'</td>' +
					'<td align="center" valign="middle">'+response[i]['Driver']+'</td>' +
					'<td align="center" valign="middle">'+response[i]['totalNumOfPassengers']+'</td>'+
					'<td align="center" valign="middle">'+response[i]['FuelConsumption']+'</td>'+
					'<td align="center" valign="middle">'+response[i]['surplus']+'</td>'+
					'</tr>';
					$("table").append(row);				
			i=i+1;
		}		
		console.log("success qwq");
		
		$('#busTable tr').click(function(){
			$(this).toggleClass('red'); 
			console.log("hello fatty ouo");
		});
	}// 成功後要執行的函數
})
	console.log("hello fatty =u=|||");
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

