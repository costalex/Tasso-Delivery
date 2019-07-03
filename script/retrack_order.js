function retrack_order(refcourse) {
  var theUrl = "/admin/trackorder/" + refcourse;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = JSON.parse(xhr.responseText);
      display_retrack_order(res, refcourse);
    }
  }
  xhr.open('GET', theUrl, true);
  xhr.send();
}

function display_retrack_order(res, refcourse) {
  if (document.getElementById('div_no_course') != null) { // efface le bloc affiché pour éviter le duplicata de bloc
    document.getElementById('div_display_course').removeChild(document.getElementById('div_no_course'));
  }
  if (document.getElementById('div_infos') != null) { // efface le bloc affiché pour éviter le duplicata de bloc
    document.getElementById('div_display_course').removeChild(document.getElementById('div_infos'));
  }

  if (res.len == 0) {
    var div_no_course = document.createElement('div');
    div_no_course.setAttribute('class', 'col-md-12 col-sm-12');
    div_no_course.setAttribute('id', 'div_no_course');
    div_no_course.setAttribute('align', 'center');
    div_no_course.setAttribute('class', 'col-md-12 col-sm-12');
    document.getElementById('div_display_course').appendChild(div_no_course);

    var text_no_course = document.createElement('p');
    text_no_course.setAttribute('class', 'bold_blue_openSans');
    text_no_course.setAttribute('style', 'font-size: 16px; padding-top: 30px; padding-bottom: 15px;');

    var text = document.createTextNode('La course n\'existe pas, ou n\'est pas encore terminée.');
    text_no_course.appendChild(text);
    document.getElementById('div_no_course').appendChild(text_no_course);
    initMap();
  }
  else {
    var div_infos = document.createElement('div'); // div contenant les infos de la course et du coursier
    div_infos.setAttribute('class', 'col-md-12 col-sm-12');
    div_infos.setAttribute('id', 'div_infos');
    document.getElementById('div_display_course').appendChild(div_infos);

    var div_infos_block1 = document.createElement('div'); // div contenant infos course
    div_infos_block1.setAttribute('class', 'col-md-12 col-sm-12');
    div_infos_block1.setAttribute('id', 'div_infos_block1');
    div_infos_block1.setAttribute('style', 'padding-top: 10px;');
    document.getElementById('div_infos').appendChild(div_infos_block1);

    var input_ref = document.createElement('input');
    input_ref.setAttribute('id', 'input_ref');
    input_ref.setAttribute('value', 'Référence: ' +refcourse);
    input_ref.setAttribute('style', 'font-size: 14px; width: 150px;');
    input_ref.setAttribute('class', 'bold_blue_montSerra input_info');
    input_ref.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block1').appendChild(input_ref);

    var div_infos_block2 = document.createElement('div'); // div contenant infos course
    div_infos_block2.setAttribute('class', 'col-md-12 col-sm-12');
    div_infos_block2.setAttribute('id', 'div_infos_block2');
    div_infos_block2.setAttribute('style', 'padding-top: 10px;');
    document.getElementById('div_infos').appendChild(div_infos_block2);

    var createDateDay = res.validateTime.day + '/' + res.validateTime.month + '/' + res.validateTime.year;
    var createDateHour = res.validateTime.hour + ':' + res.validateTime.minute;

    var startDateDay = res.startTime.day + '/' + res.startTime.month + '/' + res.startTime.year;
    var startDateHour = res.startTime.hour + ':' + res.startTime.minute;

    var endDateDay = res.endTime.day + '/' + res.endTime.month + '/' + res.endTime.year;
    var endDateHour = res.endTime.hour + ':' + res.endTime.minute;


    var input_create_course = document.createElement('input');
    input_create_course.setAttribute('id', 'input_create_course');
    input_create_course.setAttribute('value', 'Course crée le : ' + createDateDay + ' à ' + createDateHour);
    input_create_course.setAttribute('class', 'bold_dark_montSerra input_info');
    input_create_course.setAttribute('style', 'font-size: 14px;');
    input_create_course.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block2').appendChild(input_create_course);

    var input_start_course = document.createElement('input');
    input_start_course.setAttribute('id', 'input_start_course');
    input_start_course.setAttribute('value', 'Début course: ' + startDateDay + ' à ' + startDateHour);
    input_start_course.setAttribute('class', 'bold_dark_montSerra input_info');
    input_start_course.setAttribute('style', 'font-size: 14px;');
    input_start_course.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block2').appendChild(input_start_course);

    var input_end_course = document.createElement('input');
    input_end_course.setAttribute('id', 'input_end_course');
    input_end_course.setAttribute('value', 'Fin course: ' + endDateDay + ' à ' + endDateHour);
    input_end_course.setAttribute('style', 'font-size: 14px;');
    input_end_course.setAttribute('disabled', 'disabled');
    input_end_course.setAttribute('class', 'bold_dark_montSerra input_info');
    document.getElementById('div_infos_block2').appendChild(input_end_course);

    var div_infos_block3 = document.createElement('div'); // div contenant infos course
    div_infos_block3.setAttribute('class', 'col-md-12 col-sm-12');
    div_infos_block3.setAttribute('id', 'div_infos_block3');
    div_infos_block3.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px;');
    document.getElementById('div_infos').appendChild(div_infos_block3);

    var input_firstname = document.createElement('input');
    input_firstname.setAttribute('id', 'input_firstname');
    input_firstname.setAttribute('value', 'Prénom: ' + res.firstname);
    input_firstname.setAttribute('class', 'bold_dark_montSerra input_info_courier');
    input_firstname.setAttribute('style', 'font-size: 14px; width: 250px;');
    input_firstname.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block3').appendChild(input_firstname);

    var input_lastname = document.createElement('input');
    input_lastname.setAttribute('id', 'input_lastname');
    input_lastname.setAttribute('value', 'Nom: ' + res.lastname);
    input_lastname.setAttribute('class', 'bold_dark_montSerra input_info_courier');
    input_lastname.setAttribute('style', 'font-size: 14px;');
    input_lastname.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block3').appendChild(input_lastname);

    var input_phone = document.createElement('input');
    input_phone.setAttribute('id', 'input_phone');
    input_phone.setAttribute('value', 'Téléphone: ' + res.phone);
    input_phone.setAttribute('class', 'bold_dark_montSerra input_info_courier');
    input_phone.setAttribute('style', 'font-size: 14px;');
    input_phone.setAttribute('disabled', 'disabled');
    document.getElementById('div_infos_block3').appendChild(input_phone);
    display_all_position(res.arrayGps, res.len);
  }
}

function updateMap(start_lat, start_lng , end_lat, end_lng) {
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
    zoom: 15,
    styles: hideCommerce,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  },

  map = new google.maps.Map(document.getElementById('info_course_map'), myOptions),
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
}

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

  map = new google.maps.Map(document.getElementById('info_course_map'), myOptions),
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
}

function display_all_position(tab, len) {
  updateMap(tab[0].lat, tab[0].lng, tab[len - 1].lat, tab[len - 1].lng);
  for (i = 0; i < len; i++) {
    var position = new google.maps.LatLng(tab[i].lat, tab[i].lng);
    marker = new google.maps.Marker({
      position: position,
      icon: "../img/pin_circle.svg",
      map: map
    });
  }
}
