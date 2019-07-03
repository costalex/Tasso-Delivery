function setAreaLimit(autocomplete) {
  var geolocation = {
    lat: 44.836586,
    lng: -0.598951
  };
  var circle = new google.maps.Circle({
    center: geolocation,
    radius: 5200
  });
  autocomplete.setBounds(circle.getBounds());
}

// Lie le champs adresse en champs autocomplete afin que l'API puisse afficher les propositions d'adresses
function initializeAutocomplete() {
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'), {componentRestrictions: {country: 'FR'}});
  var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('destination'), {componentRestrictions: {country: 'FR' }});
  setAreaLimit(autocomplete);
  setAreaLimit(autocomplete2);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    onPlaceChanged(autocomplete, "origin");
  });
  google.maps.event.addListener(autocomplete2, 'place_changed', function () {
    onPlaceChanged(autocomplete2, "destination");
  });
}

// Injecte les données dans les champs du formulaire lorsqu'une adresse est sélectionnée
function onPlaceChanged(autoComplete, id) {
  var place = autoComplete.getPlace();
}

google.maps.event.addDomListener(window, "load")
{
  initializeAutocomplete();
};
