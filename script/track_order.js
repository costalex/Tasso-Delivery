function initMap(start_lat, start_lng , end_lat, end_lng) {
  var coords = start_lat + "," + start_lng + "|" + end_lat + "," + end_lng;
  var filteredtextCoordinatesArray = coords.split('|');
      centerLatArray = [];
      centerLngArray = [];


      for (i = 0 ; i < filteredtextCoordinatesArray.length ; i++) {

        var centerCoords = filteredtextCoordinatesArray[i];
        var centerCoordsArray = centerCoords.split(',');

        if (isNaN(Number(centerCoordsArray[0]))) {
        } else {
          centerLatArray.push(Number(centerCoordsArray[0]));
        }

        if (isNaN(Number(centerCoordsArray[1]))) {
        } else {
          centerLngArray.push(Number(centerCoordsArray[1]));
        }

      }

      var centerLatSum = centerLatArray.reduce(function(a, b) { return a + b; });
      var centerLngSum = centerLngArray.reduce(function(a, b) { return a + b; });

      var centerLat = centerLatSum / filteredtextCoordinatesArray.length ;
      var centerLng = centerLngSum / filteredtextCoordinatesArray.length ;

  var hideCommerce = [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  myOptions = {
    center: {lat: centerLat, lng: centerLng},
    zoom: 13,
    scrollwheel: false,
    styles: hideCommerce,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  },

  map = new google.maps.Map(document.getElementById('tracking_map'), myOptions),
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
}
