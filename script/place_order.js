function place_order() {
  if (!document.getElementById("origin").value && document.getElementById("destination").value != "") {
    div = $("#origin_div").closest("div");
    $("#destination_div").closest("div").removeClass("has-error");
    $("#origin_div").closest("div").removeClass("has-error");
    $("#span_error_msg_destination").remove();
    $("#span_error_msg_origin").remove();
    div.addClass("has-error");
    div.append('<span id="span_error_msg_origin" class="help-block">L\'adresse de retrait ne doit pas être vide !</span>');
    return false;
  }
  else if (!document.getElementById("destination").value && document.getElementById("origin").value != "") {
    var div = $("#destination_div").closest("div");
    $("#origin_div").closest("div").removeClass("has-error");
    $("#destination_div").closest("input").removeClass("has-error");
    $("#span_error_msg_origin").remove();
    $("#span_error_msg_destination").remove();
    div.addClass("has-error");
    div.append('<span id="span_error_msg_destination" class="help-block">L\'adresse de livraison ne doit pas être vide !</span>');
    return false;
  }

  else if (!document.getElementById("origin").value && !document.getElementById("destination").value) {
    var div_origin = $("#origin_div").closest("div");
    var div_dest = $("#destination_div").closest("div");
    $("#destination_div").closest("div").removeClass("has-error");
    $("#origin_div").closest("div").removeClass("has-error");
    $("#span_error_msg_origin").remove();
    $("#span_error_msg_destination").remove();
    div_origin.addClass("has-error");
    div_dest.addClass("has-error");
    div_origin.append('<span id="span_error_msg_origin" class="help-block">Veuillez remplir les adresses pour continuer !</span>');
    return false;
  }
  return true;
}
