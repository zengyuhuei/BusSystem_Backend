console.log(localStorage.account);

$(document).ready(function(){
	localStorage.setItem('peoplenum',0);
	$('.count').prop('disabled', true);
	$(document).on('click','.plus',function(){
		$('.count').val(parseInt($('.count').val()) + 1 );
	});
	$(document).on('click','.minus',function(){
		$('.count').val(parseInt($('.count').val()) - 1 );
		if ($('.count').val() < 0) {
			$('.count').val(0);
		}
	});
});

$(document).ready(function(){
	$('.count1').prop('disabled', true);
	$(document).on('click','.plus1',function(){
		$('.count1').val(parseInt($('.count1').val()) + 1 );
	});
	$(document).on('click','.minus1',function(){
	$('.count1').val(parseInt($('.count1').val()) - 1 );
		if ($('.count1').val() < 0) {
			$('.count').val(0);
		}
	});
});




$(document).ready(function(){
	$('.count2').prop('disabled', true);
	$(document).on('click','.save',function(){
		$('.count2').val(parseInt(localStorage.getItem('peoplenum') + $('.count').val()) - parseInt($('.count1').val()) )
		localStorage.setItem('peoplenum',$('.count2').val());
		$('.count1').val(0);
		$('.count').val(0);
	});
});

$(document).on('click','#end',function(){
	console.log("ouo");

});

