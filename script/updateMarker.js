function updateMarker(c_lat, c_lng, count, tabmarker, courier) {
  var marker = new google.maps.LatLng(c_lat, c_lng);
  if (count == 1 && courier == true) {
    tabmarker[0].setPosition(marker);
    map.refresh();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(marker);
    //console.log("refresh");
  }
  else {
    markerCourier = new google.maps.Marker({
      position: marker,
      title: "Coursier",
      icon: "../img/tasso_pin.svg",
      map: map
    }),
    tabmarker[0] = markerCourier;
  }
}

function createMarker(start_lat, start_lng, end_lat, end_lng) {
  var pointA = new google.maps.LatLng(start_lat, start_lng),
      pointB = new google.maps.LatLng(end_lat, end_lng),

  markerA = new google.maps.Marker({
    position: pointA,
    title: "Retrait",
    label: "A",
    map: map
  }),
  markerB = new google.maps.Marker({
    position: pointB,
    title: "Livraison",
    label: "B",
    map: map
  });
}

function track_order(refcourse, count, tabmarker) {
  var theUrl = "/gps/" + refcourse;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = JSON.parse(xhr.responseText);
      if (res.courier == true) {
        if (tabmarker[0] != undefined) {
          tabmarker[0].setMap(map);
          count = 1;
        }
        else {
          count = 0;
        }
      }
      updateMarker(res.start.lat, res.start.lng, count, tabmarker, res.courier);
      if ((res.courier == false && count == 0) || (res.courier == false && count == 1)) {
        tabmarker[0].setMap(null);
      }
      updateStep(res.step);
    }
  }
  xhr.open('GET', theUrl, true);
  xhr.send();
}
