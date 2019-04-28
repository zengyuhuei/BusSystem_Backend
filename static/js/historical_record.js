$(function () {
	$('#datetimepicker4').datetimepicker({
		format: 'DD/MM/YYYY'
	});
});

$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").show();
		$("#bus").show();
	})
});