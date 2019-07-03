function setAreaLimit(autocomplete) {
  var geolocation = {
    lat: 44.8473336,
    lng: -0.5846923
  };
  var circle = new google.maps.Circle({
    center: geolocation,
    radius: 3200
  });
  autocomplete.setBounds(circle.getBounds());
}

// Lie le champs adresse en champs autocomplete afin que l'API puisse afficher les propositions d'adresses
function initializeAutocomplete() {
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('profile_address'), {componentRestrictions: {country: 'FR'}});
  setAreaLimit(autocomplete);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    onPlaceChanged(autocomplete, "profile_address");
  });
}

// Récupère l'adresse entrée
function onPlaceChanged(autoComplete, id) {
  var place = autoComplete.getPlace();
}

google.maps.event.addDomListener(window, "load")
{
  initializeAutocomplete();
};
