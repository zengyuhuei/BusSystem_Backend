$(document).ready(function(){
 
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