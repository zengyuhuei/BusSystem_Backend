$(document).ready(function(){
	$(document).on('click','#btnSave',function(){
		if($('#pwd1').val()==$('#pwd2').val())
		{
			$password = $("#uname1").val();
			$new_password = $("#pwd1").val();
			//window.alert($("#uname1").val());
			console.log(localStorage.getItem("account"));
			console.log($password);
			console.log($new_password);
			account=localStorage.getItem("account");
			console.log(account);
			$.ajax({	
				type: 'POST',
				data: 'json',
				//dataType: 'json',
				//dataType: 'json',
				contentType : 'application/json',
				url: "http://127.0.0.1:3000/changePassword",
				data:JSON.stringify({
					'account' : account,
					'password' : $password,
					'new_password' : $new_password
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
				},// 錯誤後執行的函數
				success: function (response) {
					//window.location.href = xhr.responseURL;
				}// 成功後要執行的函數
			});
		}
		else
		{
			window.alert("新密碼不一樣喔!!!");
		}
		
	});

})
