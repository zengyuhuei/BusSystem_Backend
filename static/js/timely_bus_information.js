$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").show();
		$("#bus").show();
		$route = $("#inputState").val();
		load($route);
	})
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
	var map;

	var obj = Object.keys(json).map(function(_) { return json[_]; });
	console.log(obj);
	console.log(obj.length);

	var jjson = {
		bus1:{lat: 25.135139, lng: 121.782333},
		bus2:{lat: 25.139583, lng: 121.789444},
		bus3:{lat: 25.135306, lng: 121.784750},
		bus4:{lat: 25.142389, lng: 121.789306},
	}
	
	console.log(JSON.stringify(json));
	var jj = Object.keys(jjson).map(function(_) { return jjson[_]; });
	console.log(jj.length);
	
	// 載入路線服務與路線顯示圖層
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers: true // 單純畫路線，不要顯示 marker
	});

	// 初始化地圖
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 21,
	center: obj[obj.length/2]
	});

	// 放置路線圖層
	directionsDisplay.setMap(map);
	var waypts = [];
	var markers = [];
	var marker1 = [];
	
	
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
						data: obj[i].name,
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

		function busInformation()
		{
			//公車資訊
			for(var j = 0; j < jj.length ; j++){
					marker1[j] = new google.maps.Marker({
						position: jj[j],
						map: map,
						icon:'https://i.ibb.co/s6B8nGn/bb.png',
						zIndex:2
					});
					// 加入地圖標記點擊事件
					marker1[j].addListener('click', function () {
							
					});
			}
			console.log("ouo");
		}
		
		setInterval(busInformation(),2000);
		document.getElementById("yes").addEventListener("click", myFunction);
		function myFunction() {
			document.getElementById("bus").style.display==false;
			document.getElementById("map").style.display==false;
			map.setZoom(15);
			map.setCenter(obj[obj.length/2]);
		}
}