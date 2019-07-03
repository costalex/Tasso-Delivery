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
  myOptions = {
    center: {lat : 44.836586, lng : -0.598951},
    zoom: 12,
    styles: hideCommerce,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  },

  map = new google.maps.Map(document.getElementById('courier_map'), myOptions),
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
}

function updateInfoWindows(markerCourier, map, res) {
  if (res.activeCourier[j] != undefined && res.activeCourier[j].courier.idcourse)  {
    var contentString = '<div align="center"><p class="bold_blue_openSans" style="font-size: 14px;">' + 'Refcourse: ' +  res.activeCourier[j].courier.idcourse + '</p>' +
    '<p class="regular_dark_montSerra " style="font-size: 14px;">' + res.activeCourier[j].details.firstname + ' ' + res.activeCourier[j].details.lastname + '</p>' +
    '<p class="regular_dark_montSerra " style="font-size: 14px;">' + res.activeCourier[j].details.phone + '</p></div>';
  }
  else {
    var contentString = '<div align="center"><p class="bold_blue_openSans" style="font-size: 14px;">' + "Pas en course" +  '</p>' +
    '<p class="regular_dark_montSerra " style="font-size: 14px;">' + res.activeCourier[j].details.firstname + ' ' + res.activeCourier[j].details.lastname + '</p>' +
    '<p class="regular_dark_montSerra " style="font-size: 14px;">' + res.activeCourier[j].details.phone + '</p></div>';
  }
  infoWindow = new google.maps.InfoWindow({
    maxWidth: 150
  });
  markerCourier.addListener('click', function () {
	infoWindow.setContent(contentString);
	infoWindow.open(map, markerCourier);
});
}
