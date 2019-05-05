$(document).ready(function(){
	$('.count').prop('disabled', true);
	$(document).on('click','.plus',function(){
		$('.count').val(parseInt($('.count').val()) + 1 );
	});
	$(document).on('click','.minus',function(){
		$('.count').val(parseInt($('.count').val()) - 1 );
			if ($('.count').val() == 0) {
				$('.count').val(1);
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
			if ($('.count1').val() == 0) {
				$('.count1').val(1);
			}
		});
});

$(document).ready(function(){
	$('.count2').prop('disabled', true);
	$(document).on('click','.save',function(){
		$('.count2').val(parseInt($('.count').val()) - parseInt($('.count1').val()) );
	});
});

function start()
{
	var date = new Date(); //日期对象 
	var now = ""; 
	now = date.getFullYear()+"年"; //读英文就行了 
	now = now + (date.getMonth()+1)+"月"; //取月的时候取的是当前月-1如果想取当前月+1就可以了 
	now = now + date.getDate()+"日"; 
	now = now + date.getHours()+"时"; 
	now = now + date.getMinutes()+"分";
	
	console.log(now);
	//setInterval("document.getElementById('datetime').innerHTML=new Date().toLocaleString();", 1000);
	$.ajax({
		type: "POST",
		data: "json",
		dataType: "json",
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/setbusGPS",
		data:JSON.stringify({
		}),
		success: function(response) {
		},
		error: function(xhr, type) {
			console.log("hehehe");
		}
	});
}