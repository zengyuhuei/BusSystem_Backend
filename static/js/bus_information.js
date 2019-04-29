$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").toggle();
		$("#bus").toggle();
		console.log("what the fuck");
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