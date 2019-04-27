function load(){
	$.ajax({
		type: 'GET',
		url: "http://127.0.0.1:3000/getInfo?",
		dataType: 'json',
		success: function(data) {
			console.log(data);
			loaddata(data);
		},
		error: function(xhr, type) {
		}
	});
}

function loaddata(js)
{
		InputName.value = js.name;
		if(js.gender==1){
				gender1.checked = true;
				gender2.checked = false;
		}
		else if(js.gender==0){
				gender1.checked = false;
				gender2.checked = true;
		}
		date.value = js.birthday;
		InputPhone1.value = js.phone_number;
		email.value = js.email;
		identification.value = js.identification_id;
		employee.value = js._id;
		account.value = js.account;
		address.value = js.address;
		//customFile.value = js.picture;
}

$(function () {
		$('#birthday').datetimepicker({
			format: 'YYYY/MM/DD'
		});
	});

$(document).ready(function(){
	$('input[type="file"]').change(function(e){
		var fileName = e.target.files[0].name;
		$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
	$('#birthday > .form-control').prop('disabled', true);
	$(".fix").click(function() {
		$(".yes").show();
		$(".fix").hide();
		$('#InputPhone1').prop('disabled', false);
		$('#address').prop('disabled', false);
		$('#myfile').prop('disabled', false);
		$('#account').prop('disabled', false);
		$('#InputPhone1').prop('required', true);
		$('#address').prop('required', true);
		$('#myfile').prop('required', true);
		$('#account').prop('required', true);
		
	})
	/*$(".yes").click(function() {
		$(".yes").hide();
		$(".fix").show();
		$('#InputPhone1').prop('disabled', true);
		$('#address').prop('disabled', true);
		$('#myfile').prop('disabled', true);
		$('#account').prop('disabled', true);
	})*/
	
});

$( "#target" ).click(function() {
  alert( "Handler for .click() called." );
});

