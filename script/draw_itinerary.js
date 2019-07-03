initMap();
function initMap() {
  var hideCommerce = [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  var pointA = document.getElementById('sender_address').value,
  pointB = document.getElementById('recipient_address').value,
  myOptions = {
    center: {lat: 44.836586, lng: -0.598951},
    zoom: 6,
    scrollwheel: false,
    styles: hideCommerce,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  },

  map = new google.maps.Map(document.getElementById('map'), myOptions),
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  }),
  markerA = new google.maps.Marker({
    position: new google.maps.LatLng(pointA),
    title: "Retrait",
    label: "Retrait",
    map: map
  }),
  markerB = new google.maps.Marker({
    position: new google.maps.LatLng(pointB),
    title: "Livraison",
    label: "Livraison",
    map: map
  });

  // get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
    origin: pointA,
    destination: pointB,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function adapt_input(sender_phone, recipient_phone) {
  if (sender_phone == "" || sender_phone == " ") {
    document.getElementById('recap_sender_phone').setAttribute("placeholder", "Téléphone expéditeur non renseigné.");
  }
  if (recipient_phone == "" || recipient_phone == " ") {
    document.getElementById('recap_recipient_phone').setAttribute("placeholder", "Téléphone destinataire non renseigné.");
  }
}
