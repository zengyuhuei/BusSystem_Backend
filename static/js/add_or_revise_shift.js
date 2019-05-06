function setTable(response)
{
	var i = 0;
	var x = 0;
	while(response[x++]!=null);
	while(response[i]!=null)
	{
		$('[data-toggle="tooltip"]').tooltip();
		var actions = $("table td:last-child").html();
		var index = $("table tbody tr:last-child").index();
					var row = '<tr>' +
							'<td style="display: none;">'+response[i]['_id']+'</td>' +
							'<td>'+response[i]['driver']+'</td>' +
							'<td>'+response[i]['start_time']+'</td>' +
				'<td>' + actions + '</td>' +
					'</tr>';
				$("table").append(row);		
				$("table tbody tr").eq(x).find(".add,.edit").toggle();
					$('[data-toggle="tooltip"]').tooltip();			
		i=i+1;
	}	
}
function addTable(driver,time)
{
	var xhr = new XMLHttpRequest();
	$route = $("#inputRoute").val();
		$day = $("#inputDate").val();
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
		$.ajax({
			type: 'POST',
			data : 'json',
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/addShift",
			data:JSON.stringify({
				"route":$route,
				"day": $day,
				"driver":driver,
				"start_time":time
			}),
			xhr: function() {
				return xhr;
			 },
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
					console.log("AAAAA");
					window.location.href = xhr.responseURL;
					//window.location.href = response.redirect;
			}// 成功後要執行的函數
		  });

}
function delTable(id)
{
		// For Success/Failure Message
				// Check for white space in name for Success/Fail message
		var xhr = new XMLHttpRequest();
		$.ajax({
			type: 'POST',
			data : 'json',
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/delShift",
			data:JSON.stringify({
				"_id" : id
			}),
			xhr: function() {
				return xhr;
			 },
			  error: function (xhr) {
						console.log("AAAA")
				 },      // 錯誤後執行的函數
			  success: function (response) {
					console.log(response)
				window.location.href = xhr.responseURL;
			}// 成功後要執行的函數
		  });
}
function modifyTable(id,driver,time)
{
	var xhr = new XMLHttpRequest();
	$.ajax({
		type: 'POST',
		data: 'json',
		contentType : 'application/json',
		url: "http://140.121.198.84:3000/modifyShift",
		data:JSON.stringify({
			'_id' : id,
			'driver' : driver,
			'start_time' : time
		}),
		xhr: function() {
			return xhr;
 		},
			error: function (xhr) { 
			},      // 錯誤後執行的函數
			success: function (response) {
			//console.log(response);
			window.location.href = xhr.responseURL;
		}// 成功後要執行的函數
		});
}
function setid(id)
{
	var x = document.getElementById("busTable")
	x.find("tr:nth-child(end)").find("td:nth-child(1)").text() = id;
}
$(document).ready(function(){
	$(".yes").click(function() {
		$("#bus").show();		
		var tr_length = $('.table tbody tr').length; 
		for(var i=tr_length; i > 1; i--)
		{
			var td_length = $('.table tr')[i].childElementCount; //當下td長度
			$('.table tr:eq('+i+')').remove();
		}
		$route = $("#inputRoute").val();
		$day = $("#inputDate").val();
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
		$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/getShift",
			data:JSON.stringify({
				"route":$route,
				"day": $day
			}),
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
				console.log(response);
				setTable(response);
			}// 成功後要執行的函數
		  });
	})
	var actions = $("table td:last-child").html();
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		$(this).attr("disabled", "disabled");
		var optionString = '';
		check = 1;
		var i = 0;
		$.ajax({
			type: 'POST',
			data:'json',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/getDriver",
			data:JSON.stringify({
				"route":$route,
				"day": $day
			}),
				error: function (xhr) {
				 },      // 錯誤後執行的函數
				success: function (response) {
				while(response[i]!=null)
				{
					optionString+='<Option>'+response[i]+'</Option>';
					i++;
				}
				var index = $("table tbody tr:last-child").index();
				var row = '<tr>' + '<td style="display: none;"></td>' +
								'<td><select type="text" class="form-control" name="driver" id="driver">'+optionString+'</select></td>' +
								'<td><select type="text" class="form-control" name="time" id="time"><option>7:00</option><option>7:20</option><option>7:40</option><option>8:00</option><option>8:20</option><option>8:40</option><option>9:00</option><option>9:20</option>'+
					'<option>9:40</option><option>10:00</option><option>10:20</option><option>10:40</option><option>11:00</option><option>11:20</option><option>11:40</option><option>12:00</option><option>12:20</option><option>12:40</option>'+
					'<option>13:00</option><option>13:20</option><option>13:40</option><option>14:00</option><option>14:20</option><option>14:40</option><option>15:00</option><option>15:20</option><option>15:40</option><option>16:00</option></select></td>' +
					'<td>' + actions + '</td>' +
						'</tr>';
					$("table").append(row);		
				$("table tbody tr").eq(index+1).find(".add, .edit").toggle();
			}// 成功後要執行的函數
		});	
	});
	// Add row on add button click
	$(document).on("click", ".add", function(){
		var empty = false;
		var driver;
		var time;
		var input = $(this).parents("tr").find('select[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				driver = $(this).val();
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
				time = $(this).val();
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}		
		console.log(check);
		if(check == 1)
		{
			var id = $(this).closest("tr").find("td:nth-child(1)").text();
			var driver = $(this).closest("tr").find("td:nth-child(2)").text();
			var time = $(this).closest("tr").find("td:nth-child(3)").text();
			addTable(driver,time);			
		}
		else
		{
			var driver = $(this).closest("tr").find("td:nth-child(2)").text();
			var time = $(this).closest("tr").find("td:nth-child(3)").text();
			modifyTable(id,driver,time);			
		}	
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
  $(this).parents("tr").find("td:not(:last-child)").each(function(){
		var x = $(this).parents("tr").find("td:nth-child(2)")
		var optionString = '';
		check = 0;
		var i = 0;
		$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://140.121.198.84:3000/getDriver",
			data:JSON.stringify({
				"route":$route,
				"day": $day
			}),
				error: function (xhr) { },      // 錯誤後執行的函數
				success: function (response) {
				console.log(response);
				while(response[i]!=null)
				{
					optionString+='<Option>'+response[i]+'</Option>';
					i++;
				}
				x.html('<select type="text" class="form-control" name="driver" id="driver">'+optionString+'</select>');
			}// 成功後要執行的函數
		});	
			$(this).parents("tr").find("td:nth-child(3)").html('<select type="text" class="form-control" name="time" id="time"><option>7:00</option><option>7:20</option><option>7:40</option><option>8:00</option><option>8:20</option><option>8:40</option><option>9:00</option><option>9:20</option>'+
			'<option>9:40</option><option>10:00</option><option>10:20</option><option>10:40</option><option>11:00</option><option>11:20</option><option>11:40</option><option>12:00</option><option>12:20</option><option>12:40</option>'+
			'<option>13:00</option><option>13:20</option><option>13:40</option><option>14:00</option><option>14:20</option><option>14:40</option><option>15:00</option><option>15:20</option><option>15:40</option><option>16:00</option></select>');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");		
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
			var id = $(this).closest('tr').find('td:nth-child(1)').text();
			delTable(id);
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
})











