console.log(localStorage.account);

$(document).ready(function(){
	localStorage.setItem('peoplenum',0);
	$('.count').prop('disabled', true);
	$(document).on('click','.plus',function(){
		$('.count').val(parseInt($('.count').val()) + 1 );
	});
	$(document).on('click','.minus',function(){
		if(parseInt($('.count').val())!=0)
		{
			$('.count').val(parseInt($('.count').val()) - 1 );
		}
	});
});

$(document).ready(function(){
	$('.count1').prop('disabled', true);
	$(document).on('click','.plus1',function(){
		$('.count1').val(parseInt($('.count1').val()) + 1 );
	});
	$(document).on('click','.minus1',function(){
		if(parseInt($('.count1').val())!=0)
		{
			$('.count1').val(parseInt($('.count1').val()) - 1 );
		}

	});
});




$(document).ready(function(){
	$('#people_number').prop('disabled', true);
	$(document).on('click','.save',function(){
		var people_number = parseInt(localStorage.getItem('peoplenum') + $('.count').val()) - parseInt($('.count1').val())
		//$('#people_number').val(parseInt(localStorage.getItem('peoplenum') + $('.count').val()) - parseInt($('.count1').val()) )
		document.getElementById("people_number").innerHTML = people_number;
		localStorage.setItem('peoplenum',people_number);
		$('.count1').val(0);
		$('.count').val(0);
	});
});

$(document).on('click','#end',function(){
	console.log("ouo");

});

