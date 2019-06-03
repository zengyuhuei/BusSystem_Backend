$(function () {
	$('#birthday').datetimepicker({
		format: 'YYYY/MM/DD'
	});
});


$(document).ready(function(){
	$('input[type="file"]').change(function(e){
		var fileName = e.target.files[0].name;
		//localStorage.setItem('Account',fileName);
		$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
	$(".manager_name").html(localStorage.getItem("name"));
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
