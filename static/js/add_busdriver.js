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
});
function deleteItem()
{
	localStorage.removeItem();
}