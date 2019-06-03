$(document).ready(function(){
	$(".manager_name").html(localStorage.getItem("name"));
});
function setTable(response)
{
	var table = document.getElementById("bus");
	var newRow = table.insertRow(); //建立新行
	var newCell = newRow.insertCell(); //建立新單元格
	var newCell2 = newRow.insertCell(); //建立新單元格
	var newCell3 = newRow.insertCell(); //建立新單元格
	newCell.innerHTML = response["driver"]; //單元格內的內容
	newCell2.innerHTML = response["start_time"]; //單元格內的內容
	var editButton = document.createElement("button").innerHTML = "編輯";
	newCell3.innerHTML = '<button>編輯</button>'; //單元格內的內容
	newCell3.innerHTML = '<button>刪除</button>'; //單元格內的內容
}


function getDriverState()
{
    $('#driverBody > tr ').remove();
    var day_list = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var date = new Date();
    var day  = date.getDay();
    var key = document.getElementById("name");
    console.log(day_list[day])
	$.ajax({
        type: "POST",
        data: "json",
        dataType: "json",
        contentType : 'application/json',
        url: "http://127.0.0.1:3000/humanDispatch",
        data:JSON.stringify({
            "day": day_list[day],
            "keyword":key.value
        }),
        success: function(response) {
            console.log(response);
            var i = 0;
            while(response[i]!=null)
            {
                console.log("SS")
                var actions = $("table td:last-child").html();
                var index = $("table tbody tr:last-child").index();
                            if(response[i]['state'] == 1)
                            {
                                response[i]['state'] = "待命中"
                            }
                            else if(response[i]['state'] == 2)
                            {
                                response[i]['state'] = "駕駛中"
                            }
                            else
                            {
                                response[i]['state'] = "休假中"
                            }
                            var row = '<tr id = "tableCell">' +
                                    '<td style="display: none;">'+response[i]['_id']+'</td>' +
                                    '<td>'+response[i]['driverName']+'</td>' +
                                    '<td>'+response[i]['state']+'</td>' +
                                    '<td>' + response[i]['workTime'] + '</td>' +
                            '</tr>';
                        $("table").append(row);      
                i=i+1;
            }   
        },
        error: function(xhr, type) {
                console.log("gr nb");
        }
    });

}




function load()
{
	websocket_init();
	getDriverState();
}