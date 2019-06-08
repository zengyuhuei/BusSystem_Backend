$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").show();
		$("#bus").show();
		$route = $("#inputRoute").val();
		load($route);
		getTable();
	})
	$(".manager_name").html(localStorage.getItem("name"));
});
$(function(){
    $('td').click(function(){
        $(this).toggleClass('red'); 
    });
});
function setTable(response)
{ 
	console.log("CC");
	var table = document.getElementById("busTable");
	for(var i=table.rows.length - 1; i > 0; i--)
	{
		table.deleteRow(i);
	}
	i = 0;
	while(response[i]!=null)
	{
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
	row = " ";
}
function getTable()
{
	$route = $("#inputRoute").val();
	$day = $("#inputDate").val();
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
			setTable(response);
		}// 成功後要執行的函數
	});
}

function load(route)
{	
	$.ajax({
		type: 'POST',
		data: 'json',
		dataType:'json',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/getRoute",
		data:JSON.stringify({
			"route": route
		}),
		success: function(response) {
			console.log(response);
			returnRoute(response);
		},
		error: function(xhr) {
			console.log("ouo");
		}
	});
}

function returnRoute(json)
{
	var map;
	
	var obj = Object.keys(json).map(function(_) { return json[_]; });
	console.log(obj[0]);

	// 載入路線服務與路線顯示圖層
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer({
	suppressMarkers: true // 單純畫路線，不要顯示 marker
	});

	// 初始化地圖
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 19,
	center: obj[obj.length/2]
	});

	// 放置路線圖層
	directionsDisplay.setMap(map);
	var waypts = [];
	var markers = [];

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
function setData(xString)
{
	document.getElementById("shift").innerHTML += '<select class="form-control" id="inputRoute">'+xString+'</select>';
}

function start()
{
	var x = document.getElementById("inputRoute");
	var optionString = '';
	var i = 0;
	const p =new Promise(
		(resolve,reject)=>{	$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/getbusNumber",
			data:JSON.stringify({
				
			}),
				error: function (xhr) { },      // 錯誤後執行的函數
				success: function (response) {
				console.log("下拉式選單: "+response);
				while(response[i]!=null)
				{
					optionString +='<Option>'+response[i]["bus_route"]+'</Option>';
					console.log("下拉式選單: "+response[i]["bus_route"]);
					i++;
				}
				//x.html(optionString);
			}// 成功後要執行的函數
		}).done(result => resolve(optionString))
	}).then(result => setData(optionString));	
	websocket_init();
}
