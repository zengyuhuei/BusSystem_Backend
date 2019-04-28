$(document).ready(function(){
	$(".yes").click(function() {
		$("#bus").toggle();
		$(".add").toggle();
		$route = $("#inputRoute").val();
		$day = $("#inputDate").val();
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
      	let data = {
			"route":$route,
			"day": $day
		}
		$.ajax({
			type: 'POST',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/getShift",
			data:JSON.stringify({
				"route":$route,
				"day": $day
			}),
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
				console.log(response);
				setTable(response);
			}// 成功後要執行的函數
		  });
	})
})