$(document).ready(function(){
	$('input[type="file"]').change(function(e){
		var fileName = e.target.files[0].name;
		$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
	$(".manager_name").html(localStorage.getItem("name"));
});

function checkForm(data)
{
	return confirm('Are you sure you want to proceed?');
}
