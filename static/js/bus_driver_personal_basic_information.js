
//把值轉成json檔
function display(){

		/*if(gender1.checked==true){
				var gg = 1;
		}
		else if(gender2.checked==true){
				gg = 0;
		}

		var json = {
				'name': InputName.value,
				'gender': gg,
				'birthday': $("#birthday").find("input").val(),
				'phone_number': InputPhone1.value,
				'email': email.value,
				'identification_id': identification.value,
				'account': account.value,
				'address': address.value,
				'picture': customFile.value
		}
		var kk = JSON.stringify(json);
		console.log(kk);

		$.ajax({
				type: 'POST',
				url: "http://127.0.0.1:3000/add_info_to_db",
				dataType: 'json',
				data: JSON.stringify({
						'name': InputName.value,
						'gender': gg,
						'birthday': $("#birthday").find("input").val(),
						'phone_number': InputPhone1.value,
						'email': email.value,
						'identification_id': identification.value,
						'account': account.value,
						'address': address.value,
						'picture': customFile.value
				}),
				success: function(data) {
					console.log(data);
				},
				error: function(xhr, type) {
				}
		});*/
}

//測試資料
/*var js = {
		'name': 'tseng', 
		'gender': 0, 
		'birthday': '2019/04/11',
		'phone_number': '0918338687',
		'email': 'zengyuhuei@gmail.com', 
		'identification_id': 'F123456789', 
		'account': '123456',
		'address': 'ananaana',
		'picture': 'file.jpg'
}*/

//讀取資料庫資料
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
		$('#customFile').prop('disabled', false);
		$('#account').prop('disabled', false);
		
		$('#InputPhone1').prop('required', true);
		$('#address').prop('required', true);
		$('#customFile').prop('required', true);
		$('#account').prop('required', true);
		
	})
	/*$(".yes").click(function() {
		$(".yes").hide();
		$(".fix").show();
		$('fieldset').prop('disabled', true);
		$('#birthday > .form-control').prop('disabled', true);
	})*/
	
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
		});

		$('.btn-file :file').on('fileselect', function(event, label){
		    
		    var input = $(this).parents('.input-group').find(':text'),
		        log = label;
		    
		    if( input.length ) {
		        input.val(log);
		    } else {
		        if( log ) alert(log);
		    }
	    
		});
		function readURL(input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();
		        
		        reader.onload = function (e) {
		            $('#img-upload').attr('src', e.target.result);
		        }
		        
		        reader.readAsDataURL(input.files[0]);
		    }
		}

		$("#imgInp").change(function(){
		    readURL(this);
		}); 	
});