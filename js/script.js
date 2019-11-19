console.log('direction');

// accessing apiKey from config.json
// apiKey = '[{"key" : "yourKeyGoesHere"}]';
var myKey = JSON.parse(apiKey); // Convert JSON data into js object
console.log(myKey[0].key);

// Dynamically creating the script element
var script = document.createElement('script');
// Giving the src attribute to the google plug in from external json file
script.src = 'https://maps.googleapis.com/maps/api/js?key=' + myKey[0].key + '&callback=initMap';
// Appending to the body of index.html
document.getElementsByTagName('body')[0].appendChild(script); 

function initMap() {
	var directionsService = new google.maps.DirectionsService;
	var directionsRenderer = new google.maps.DirectionsRenderer;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: 41.85, lng: -87.65}
	});
	directionsRenderer.setMap(map);
	document.getElementById('submit').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	});
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
var waypts = [];
var checkboxArray = document.getElementById('waypoints');
for (var i = 0; i < checkboxArray.length; i++) {
	if (checkboxArray.options[i].selected) {
		waypts.push({
			location: checkboxArray[i].value,
			stopover: true
		});
	}
}
// test
	directionsService.route({
		origin: document.getElementById('start').value,
		destination: document.getElementById('end').value,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}, 
	function(response, status) {
		if (status === 'OK') {
			directionsRenderer.setDirections(response);
			var route = response.routes[0];
			var summaryPanel = document.getElementById('directions-panel');
			summaryPanel.innerHTML = '';
			// For each route, display summary information.
			for (var i = 0; i < route.legs.length; i++) {
				var routeSegment = i + 1;
				summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
						'</b><br>';
				summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
				summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
				summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
			}
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}
