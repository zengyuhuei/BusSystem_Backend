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
		$('fieldset').prop('disabled', false);
		$('#birthday > .form-control').prop('disabled', false);
		
		
	})
	$(".yes").click(function() {
		$(".yes").hide();
		$(".fix").show();
		$('fieldset').prop('disabled', true);
		$('#birthday > .form-control').prop('disabled', true);
	})
	
	
	
});

$( "#target" ).click(function() {
  alert( "Handler for .click() called." );
});

