$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").toggle();
		$("#bus").toggle();
		console.log("what the fuck");
	})
});

function disappear()
{
		var googleMap = document.getElementById("map");
		console.log("= =");
		googleMap.style.display = block;
}