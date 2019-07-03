function registration() {

  var registration_password = document.getElementById("registration_password").value;
  var confirmation_password = document.getElementById("confirmation_password").value;
  var registration_email = document.getElementById("registration_email").value;
  var registration_phone = document.getElementById("registration_phone").value;


  if (registration_phone.length > 10 || registration_phone.length < 10) {
    reg = /^0[1-9]([ ]?[0-9]{2}){4}$/
    if (!reg.test(registration_phone)) {
      var div = $("#divBlock2").closest("div");
      var input = $("#registration_phone").closest("input");
      div.addClass("has-error");
      input.addClass("form-control_error");
      $("#span_error_msg").remove();
      $("#registration_email").closest("input").removeClass("form-control_error");
      $("#registration_password").closest("input").removeClass("form-control_error");
      $("#confirmation_password").closest("input").removeClass("form-control_error");
      div.append('<span id="span_error_msg" class="help-block">Le telephone est incorrect !</span>');
      return false;
    }
  }

    if (registration_email.length < 6 || registration_email.length >= 6) {
      var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!reg.test(registration_email)) {
        var div = $("#divBlock2").closest("div");
        var input = $("#registration_email").closest("input");
        div.addClass("has-error");
        input.addClass("form-control_error");
        $("#span_error_msg").remove();
        $("#registration_password").closest("input").removeClass("form-control_error");
        $("#confirmation_password").closest("input").removeClass("form-control_error");
        $("#registration_phone").closest("input").removeClass("form-control_error");
        div.append('<span id="span_error_msg" class="help-block">Email incorrect !</span>');
        return false;
      }
    }

  if (registration_password.length >= 6 || registration_password.length < 6) {
    reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)({6,15})$/
    if (!reg.test(registration_password)) {
      var div = $("#divBlock2").closest("div");
      var input = $("#registration_password").closest("input");
      div.addClass("has-error");
      input.addClass("form-control_error");
      $("#span_error_msg").remove();
      $("#registration_email").closest("input").removeClass("form-control_error");
      $("#registration_phone").closest("input").removeClass("form-control_error");
      $("#confirmation_password").closest("input").removeClass("form-control_error");
      div.append('<span id="span_error_msg" class="help-block">Le mot de passe doit faire au moins 6 caracteres et contenir 1 majuscule, 1 minucule et 1 chiffre !</span>');
      return false;
    }
  }

  if (confirmation_password != registration_password) {
    var div = $("#div_password").closest("div");
    var mdp1 = $("#registration_password").closest("input");
    var mdp2 = $("#confirmation_password").closest("input");
    $("#span_error_msg").remove();
    div.addClass("has-error");
    $("#registration_email").closest("input").removeClass("form-control_error");
    $("#registration_phone").closest("input").removeClass("form-control_error");
    mdp1.addClass("form-control_error input_top");
    mdp2.addClass("form-control_error input_bot");
    div.append('<span id="span_error_msg" class="help-block">Les 2 mots de passe ne correspondent pas !</span>');
    return false;
  }

  if (document.getElementById('cgu_checkbox').checked == false)
  {
    var div = $("#cgu_block").closest("div");
    var input = $("#cgu_checkbox").closest("input");
    div.addClass("has-error");
    $("#span_error_msg").remove();
    $("#registration_email").closest("input").removeClass("form-control_error");
    $("#registration_password").closest("input").removeClass("form-control_error");
    div.append('<span id="span_error_msg" class="help-block">Veuillez accepter les CGU !</span>');
    return false;
  }
  if (document.getElementById('cgu_checkbox').checked == true)
  {
    return true;
  }
  return false;
}
