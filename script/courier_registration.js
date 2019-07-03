function courier_registration() {
  var registration_siren = document.getElementById("registration_courier_siren").value;
  var registration_siret = document.getElementById("registration_courier_siret").value;

  if (registration_siren.length != 9 || registration_siret.length != 14) {
    if (registration_siren.length != 9) {
      var div = $("#divBlock1").closest("div");
      var input = $("#registration_courier_siren").closest("input");
      div.addClass("has-error");
      input.addClass("form-control");
      $("#span_error_msg").remove();
      $("#registration_courier_siret").closest("input").removeClass("form-control");
      div.append('<span id="span_error_msg" class="help-block">Le numéro de SIREN doit contenir 9 chiffres !</span>');
      return false;
    }
    if (registration_siret.length != 14) {
      var div = $("#divBlock1").closest("div");
      var input = $("#registration_courier_siret").closest("input");
      div.addClass("has-error");
      input.addClass("form-control");
      $("#span_error_msg").remove();
      $("#registration_courier_siren").closest("input").removeClass("form-control");
      div.append('<span id="span_error_msg" class="help-block">Le numéro de SIRET doit contenir 14 chiffres !</span>');
      return false;
    }
  }
  return true;
}

function setActivityArea(tab, len) {
  tmp = tab.replace(/&#34;/g, '\"');
  areaTab = JSON.parse(tmp);

  if (len == 0) {
    var zone = document.createElement('option');
    zone.setAttribute('name', 'Autre choix');
    document.getElementById('selectAreaZone').appendChild(zone);

    var text = document.createTextNode('Autre choix');
    zone.appendChild(text);
  }

  for (i = 0; i < len; i++) {
    var zone = document.createElement('option');
    zone.setAttribute('name', areaTab[i].name);
    document.getElementById('selectAreaZone').appendChild(zone);

    var text = document.createTextNode(areaTab[i].name);
    zone.appendChild(text);
  }

}
