function setName()
{
	console.log(localStorage.getItem("account"));
	$.ajax({
		type: 'POST',
		dataType : 'json',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/get_name",
		data:JSON.stringify({
			"email":localStorage.getItem("account")
		}),

		error: function (jqXHR, exception) {
			var msg = '';
			if (jqXHR.status === 0) {
				msg = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				msg = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				msg = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				msg = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				msg = 'Time out error.';
			} else if (exception === 'abort') {
				msg = 'Ajax request aborted.';
			} else {
				msg = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			console.log(msg);
		},      // 錯誤後執行的函數
		success: function (response) {
				console.log(response);
				localStorage.setItem("name",response['name'])
				//window.location.href = response.redirect;
		}// 成功後要執行的函數
	});
	
	
}