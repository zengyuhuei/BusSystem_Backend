$(function () {
	$('#datetimepicker4').datetimepicker({
		format: 'DD/MM/YYYY'
	});
});

$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").show();
		$("#bus").show();
		$route = $("#inputState").val();
		load($route);
	})
	$("#manager_name").html("管理者："+localStorage.getItem("name"));
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

function returnRoute(json)
{
	var map ;

	/*var json = {
		position1: {name: "深美國小", lat: 25.136333, lng: 121.778361},
		position2: {name: "深溪路口", lat: 25.135139, lng: 121.782333},
		position3: {name: "海中天社區", lat: 25.135306, lng: 121.784750},
		position4: {name: "巴塞隆納社區", lat: 25.135611, lng: 121.785639},
		position5: {name: "碧海擎天社區", lat: 25.136333, lng: 121.787778},
		position6: {name: "普羅旺世社區", lat: 25.137444, lng: 121.788667},
		position7: {name: "八斗高中", lat: 25.139583, lng: 121.789444},
		position8: {name: "福泉寺", lat: 25.142389, lng: 121.789306},
	}*/
	
	console.log(JSON.stringify(json));
	
	function initMap() {
		}
		// 載入路線服務與路線顯示圖層
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true // 單純畫路線，不要顯示 marker
		});

		// 初始化地圖
		map = new google.maps.Map(document.getElementById('map'), {
		zoom: 18,
		center: json.position2
		});

		// 放置路線圖層
		directionsDisplay.setMap(map);
	

		
		var waypts = [];
		var markers = [];
		
		var obj = Object.keys(json).map(function(_) { return json[_]; });
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
					data: obj[i].route
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