function setTable(response)
{
	var i = 0;
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
				$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
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
				console.log(response);
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
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
				console.log(response);
			}// 成功後要執行的函數
		  });
}
function modifyTable(id,driver,time)
{
		$.ajax({
			type: 'POST',
			dataType : 'json',
			contentType : 'application/json',
			url: "http://127.0.0.1:3000/delShift",
			data:JSON.stringify({
				"_id":id,
				"driver":driver,
				"start_time":time
			}),
			  error: function (xhr) { },      // 錯誤後執行的函數
			  success: function (response) {
				console.log(response);
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
	
	$('[data-toggle="tooltip"]').tooltip();
	var actions = $("table td:last-child").html();
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		$(this).attr("disabled", "disabled");
		var index = $("table tbody tr:last-child").index();
				var row = '<tr>' +
						'<td style="display: none;"></td>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><input type="text" class="form-control" name="department" id="department"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	var check = 0;
	$(document).on("click", ".add", function(){
		var empty = false;
		var driver;
		var time;
		var input = $(this).parents("tr").find('input[type="text"]');
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
			var id = $(this).parent("tr").find("td:nth-child(1)");
			modifyTable(id,driver,time);
			check = 0;
		}
		else
			addTable(driver,time);		
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
		check = 1;
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
			console.log("AAA")
			var id = $(this).closest('tr').find('td:nth-child(1)').text();
			delTable(id);
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
})











