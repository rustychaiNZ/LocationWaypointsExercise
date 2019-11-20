console.log('direction');

// accessing apiKey from config.json
// apiKey = '[{"key" : "yourKeyGoesHere"}]';
var myKey = JSON.parse(apiKey); // Convert JSON data into js object

// Dynamically creating the script element
var script = document.createElement('script');
// Giving the src attribute to the google plug in from external json file
script.src = 'https://maps.googleapis.com/maps/api/js?key=' + myKey[0].key + '&callback=initMap';
// Appending to the body of index.html
document.getElementsByTagName('body')[0].appendChild(script); 


function initMap() {
	// Needed to make routues between places. It will open a new object called 'dircetionsService' 
	var directionsService = new google.maps.DirectionsService;
	var directionsRenderer = new google.maps.DirectionsRenderer;
	// Creating the new map object
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: -41.010786, lng: 175.325764}  
	});
	directionsRenderer.setMap(map);
	// When the submit button is clicked, the function to calculate the distance between the start and stop markers are calculated
	document.getElementById('submit').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	});
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
	var waypts = [];
	// Gets the user's selected stops from the waypoints multi select box
	var checkboxArray = document.getElementById('waypoints');
	// Loop is to find if more than one waypoint has been selected
	for (var i = 0; i < checkboxArray.length; i++) {
		// If more than one point is selected, the waypoints are added to an array
		if (checkboxArray.options[i].selected) {
			waypts.push({
				location: checkboxArray[i].value,
				stopover: true
			});
		}
	}

	directionsService.route({
		origin: document.getElementById('start').value,
		destination: document.getElementById('end').value,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}, 
	function(response, status) {
		if (status === 'OK') {

			console.log(response);

			directionsRenderer.setDirections(response);
			var route = response.routes[0];

			console.log(route);

			var summaryPanel = document.getElementById('directions-panel');
			summaryPanel.innerHTML = '';
			// For each route, display summary information.
			for (var i = 0; i < route.legs.length; i++) {
				var routeSegment = i + 1;
				summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
						'</b><br>';
				summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
				summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
				summaryPanel.innerHTML += route.legs[i].distance.text + '<br>'; 
				summaryPanel.innerHTML += route.legs[i].duration.text + '<br>';
				var distance = route.legs[i].distance.text;
			}
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}
