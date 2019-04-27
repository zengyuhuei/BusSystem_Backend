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
		
	})
	$(".yes").click(function() {
		$(".yes").hide();
		$(".fix").show();
		$('#InputPhone1').prop('disabled', true);
		$('#address').prop('disabled', true);
		$('#myfile').prop('disabled', true);
		$('#account').prop('disabled', true);
	})
	
	
	
});

$( "#target" ).click(function() {
  alert( "Handler for .click() called." );
});

