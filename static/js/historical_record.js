
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
		let time = $("#time").val();
		console.log(route);
		console.log(time);
		createTable(route,time);
	})

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
	$(".manager_name").html(localStorage.getItem("name"));
	$('#birthday').datetimepicker({
		format: 'YYYY/MM/DD'
	});
});

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
function start()
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

