function load(){
	
	$.ajax({
		type: 'GET',
		url: "http://140.121.198.84:3000/getInfo?",
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
		console.log(js.picture);
		$('#blah').attr('src', '/static/picture/'+js.picture);
		$('#blah').attr("width", "300");
		$('#blah').attr("height", "400");
}

$(function () {
		$('#birthday').datetimepicker({
			format: 'YYYY/MM/DD'
		});
	});

$(document).ready(function(){
	
	
	$(".manager_name").html(localStorage.getItem("name"));
	$('#birthday > .form-control').prop('readonly', true);
	$(".fix").click(function() {
		$(".yes").show();
		$(".cancel").show();
		$(".fix").hide();
		$('.custom-file').show();
		$('#InputPhone1').prop('readonly', false);
		$('#address').prop('readonly', false);
		$('#myfile').prop('disabled', false);
		$('#account').prop('readonly', false);
		
		$('#InputPhone1').prop('required', true);
		$('#address').prop('required', true);
		$('#myfile').prop('required', true);
		$('#account').prop('required', true);
		
	})
	$(".cancel").click(function() {
		location.reload();
		$(".yes").hide();
		$(".cancel").hide();
		$(".fix").show();
		$('.custom-file').hide();
		$('#InputPhone1').prop('required', false);
		$('#address').prop('required', false);
		$('#myfile').prop('required', false);
		$('#account').prop('required', false);
		
		$('#InputPhone1').prop('readonly', true);
		$('#address').prop('readonly', true);
		$('#myfile').prop('disabled', true);
		$('#account').prop('readonly', true);
	})
});
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#blah')
				.attr('src', e.target.result)
				.width(300)
				.height(400);
		};

		reader.readAsDataURL(input.files[0]);
	}
}
$(document).ready(function(){
	$('input[type="file"]').change(function(e){
		var fileName = e.target.files[0].name;
		//localStorage.setItem('Account',fileName);
		$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
});

$( "#target" ).click(function() {
  alert( "Handler for .click() called." );
});

function checkForm(data)
{
	return confirm('Are you sure you want to proceed?');
}
