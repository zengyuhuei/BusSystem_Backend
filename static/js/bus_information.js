$(document).ready(function(){
	$(".yes").click(function() {
		$("#map").toggle();
		$("#bus").toggle();
		console.log("what the fuck");
		var route= "104";
		load(route);
	})
});

function load(route){
	
	$.ajax({
		type: 'POST',
		data: 'json',
		contentType : 'application/json',
		url: "http://127.0.0.1:3000/getRoute",
		data:JSON.stringify({
			"route": route
		}),
		success: function(response) {
			console.log(response);
		},
		error: function(xhr, type) {
			console.log("ouo");
		}
	});
}