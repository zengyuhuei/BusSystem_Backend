function getData()
{
	let data = {
		"route":$route,
		"day": $day
	}
	$.ajax({
		type: 'GET',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/getShift?data="+data,
	  	error: function (xhr) { },      // 錯誤後執行的函數
	  	success: function (response) {
			console.log(response)
		}// 成功後要執行的函數
  	});
}
$(document).ready(function(){
	$(".yes").click(function() {
		$("#bus").toggle();
		$(".add").toggle();
		$route = $("#inputRoute").val();
		$day = $("#inputDate").val();
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
      	getData();
	})
})