$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").show();
		$("#bus").show();
	})
});

function disappear()
{
		var googleMap = document.getElementById("map");
		googleMap.style.display = block;
}