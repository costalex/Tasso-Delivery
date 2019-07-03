function send_msg_contact() {
  if (document.getElementById("email").value == "") {
    div = $("#div_email").closest("div");
    $("#div_message").closest("div").removeClass("has-error");
    $("#div_email").closest("div").removeClass("has-error");
    $("#span_error_email").remove();
    $("#span_error_msg").remove();
    div.addClass("has-error");
    div.append('<span align="left" style="padding-left:30px;"" id="span_error_email" class="help-block">Veuillez renseigner votre adresse mail!</span>');
    return false;
  }
  if (document.getElementById("message").value == "") {
    div = $("#div_message").closest("div");
    $("#div_message").closest("div").removeClass("has-error");
    $("#div_email").closest("div").removeClass("has-error");
    $("#span_error_email").remove();
    $("#span_error_msg").remove();
    div.addClass("has-error");
    div.append('<span align="left" style="padding-left:30px;"" id="span_error_message" class="help-block">Veuillez préciser votre message</span>');
    return false;
  }
  return true;
}
