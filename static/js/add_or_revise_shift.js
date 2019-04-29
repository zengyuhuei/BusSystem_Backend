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
	$route = $("#inputRoute").val();
		$day = $("#inputDate").val();
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
		$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/addShift",
			data:JSON.stringify({
				"route":$route,
				"day": $day,
				"driver":driver,
				"start_time":time
			}),
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
					console.log("AAA");
					window.location.href = response.redirect;
			}// 成功後要執行的函數
		  });

}
function delTable(id)
{
		// For Success/Failure Message
      	// Check for white space in name for Success/Fail message
		$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/delShift",
			data:JSON.stringify({
				"_id" : id
			}),
			  error: function (xhr) {

				 },      // 錯誤後執行的函數
			  success: function (response) {
				console.log(response);
			}// 成功後要執行的函數
		  });
}
function modifyTable(id,driver,time)
{
	$.ajax({
		type: 'POST',
		data: 'json',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/modifyShift",
		data:JSON.stringify({
			'_id' : id,
			'driver' : driver,
			'start_time' : time
		}),
			error: function (xhr) { 
			},      // 錯誤後執行的函數
			success: function (response) {
			window.location.href = response.redirect;
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
			url: "http://127.0.0.1:3000/getShift",
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
		var index = $("table tbody tr:last-child").index();
		var row = '<tr>' + '<td style="display: none;"></td>' +
            '<td><select type="text" class="form-control" name="driver" id="driver"><option>gggg</option><option>ffff</option><option>eeee</option><option>dddd</option><option>cccc</option><option>bbbb</option><option>aaaa</option></select></td>' +
            '<td><select type="text" class="form-control" name="time" id="time"><option>7:00</option><option>7:20</option><option>7:40</option><option>8:00</option><option>8:20</option><option>8:40</option><option>9:00</option><option>9:20</option>'+
			'<option>9:40</option><option>10:00</option><option>10:20</option><option>10:40</option><option>11:00</option><option>11:20</option><option>11:40</option><option>12:00</option><option>12:20</option><option>12:40</option>'+
			'<option>13:00</option><option>13:20</option><option>13:40</option><option>14:00</option><option>14:20</option><option>14:40</option><option>15:00</option><option>15:20</option><option>15:40</option><option>16:00</option></select></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index+1).find(".add, .edit").toggle();
    });
	// Add row on add button click
	var checkTable = 0;
	$(document).on("click", ".add", function(){
		var empty = false;
		check = 1;
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
		
		if(check == 1)
		{
			var id = $(this).closest("tr").find("td:nth-child(1)").text();
			var driver = $(this).closest("tr").find("td:nth-child(2)").text();
			var time = $(this).closest("tr").find("td:nth-child(3)").text();
			modifyTable(id,driver,time);
			check = 0;
		}
		else
			var driver = $(this).closest("tr").find("td:nth-child(2)").text();
			var time = $(this).closest("tr").find("td:nth-child(3)").text();
			addTable(driver,time);		
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).children().html('<select type="text" class="form-control" name="driver" id="driver"><option>gggg</option><option>ffff</option><option>eeee</option><option>dddd</option><option>cccc</option><option>bbbb</option><option>aaaa</option></select>');
			//console.log($(this).children("#driver"));
			//$(this).children.html('<select type="text" class="form-control" name="driver" id="driver"><option>gggg</option><option>ffff</option><option>eeee</option><option>dddd</option><option>cccc</option><option>bbbb</option><option>aaaa</option></select>');
			/*$(this).children().html('<select type="text" class="form-control" name="time" id="time"><option>7:00</option><option>7:20</option><option>7:40</option><option>8:00</option><option>8:20</option><option>8:40</option><option>9:00</option><option>9:20</option>'+
			'<option>9:40</option><option>10:00</option><option>10:20</option><option>10:40</option><option>11:00</option><option>11:20</option><option>11:40</option><option>12:00</option><option>12:20</option><option>12:40</option>'+
			'<option>13:00</option><option>13:20</option><option>13:40</option><option>14:00</option><option>14:20</option><option>14:40</option><option>15:00</option><option>15:20</option><option>15:40</option><option>16:00</option></select>');*/
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
		check = 1;
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
			var id = $(this).closest('tr').find('td:nth-child(1)').text();
			delTable(id);
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
})











