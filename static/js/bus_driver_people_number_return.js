console.log(localStorage.account);
var people_number1 = 0;
var busoff_people;
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
	$(".driver_name").html(localStorage.getItem("name"));
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
	$(document).on('click','#delete',function(){
		$('.count1').val(0);
		$('.count').val(0);
	});
});




$(document).ready(function(){
	//$('#people_number').prop('disabled', true);
	$(document).on('click','.save',function(){
		
		/*console.log(people_number1);
		people_number1 = parseInt(localStorage.getItem('peoplenum')) + parseInt($('.count').val()) - parseInt($('.count1').val());
		console.log(localStorage.getItem('peoplenum'));
		console.log(people_number1);
		console.log($('.count').val());
		console.log($('.count1').val());
		//$('#people_number').val(parseInt(localStorage.getItem('peoplenum') + $('.count').val()) - parseInt($('.count1').val()) )
		localStorage.setItem('peoplenum',people_number1);
		if(localStorage.getItem('peoplenum')>0)
			document.getElementById("people_number").innerHTML = localStorage.getItem('peoplenum');
		else
		{
			document.getElementById("people_number").innerHTML = "0";
			localStorage.setItem('peoplenum',0);
			people_number1 = 0;
		}*/
		if((people_number1 + parseInt($('.count').val()) - parseInt($('.count1').val()))>0){
			people_number1 = people_number1 + parseInt($('.count').val()) - parseInt($('.count1').val());
			busoff_people = parseInt($('.count1').val());
		}
		else{
			busoff_people = people_number1;
			people_number1 = 0;
		}
		console.log("qqqqq" + people_number1);
		console.log("sssssssss" + busoff_people);
		
		$.ajax({
			type: "POST",
			data: "json",
			dataType: "json",
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/peoplenum_to_db",
			data:JSON.stringify({
				"driver":localStorage.account,
				"day": day_list[day],
				"start_time": "7:00",
				"peoplenum": people_number1,
			}),
			success: function(response) {
				console.log(response);
				document.getElementById("people_number").innerHTML = response.peoplenum;
				people_number1 = response.peoplenum;
			},
			error: function(xhr, type) {
				console.log("hehehe");
			}
		});

		$.ajax({
			type: "POST",
			data: "json",
			dataType: "json",
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/setonBusoffBus",
			data:JSON.stringify({
				"email":localStorage.account,
				"start_time": "7:00",
				"onbus": parseInt($('.count').val()),
				"offbus": busoff_people,
				"arrivaltime": now
			}),
			success: function(response) {
				console.log(response);
			},
			error: function(xhr, type) {
				console.log("bus is wrong");
			}
		});

		$('.count1').val(0);
		$('.count').val(0);

	});
	
});

