function change_password() {
  var current_password_length = document.getElementById("current_password").value.length;
  var new_password_length = document.getElementById("new_password").value.length;
  var confirm_new_password_length = document.getElementById("confirm_new_password").value.length;

  var current_password = document.getElementById("current_password").value;
  var new_password = document.getElementById("new_password").value;
  var confirm_new_password = document.getElementById("confirm_new_password").value;

  var span_current_password = document.getElementById('span_current_password');
  var span_new_password = document.getElementById('span_new_password');
  var span_confirm_new_password = document.getElementById('span_confirm_new_password');

  var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

  if (new_password_length >= 6 && confirm_new_password_length >= 6 && reg.test(new_password) == true) {
    if (current_password == new_password) {
      var div = $("#div_new_password").closest("div");
      $("#span_current_password").remove();
      $("#span_new_password").remove();
      $("#span_confirm_new_password").remove();
      div.addClass("has-error");
      div.append('<span id="span_new_password" class="help-block">Le nouveau mot de passe doit etre différent de l\'ancien !</span>');
      return false;
    }

    if (new_password != confirm_new_password) {
      var div = $("#div_confirm_new_password").closest("div");
      $("#span_current_password").remove();
      $("#span_new_password").remove();
      $("#span_confirm_new_password").remove();
      div.addClass("has-error");
      div.append('<span id="span_confirm_new_password" class="help-block">Les 2 mots de passe ne correspondent pas !</span>');
      return false;
    }
  }
  else {
    if (!reg.test(new_password)) {
      var div = $("#div_new_password").closest("div");
      $("#span_current_password").remove();
      $("#span_new_password").remove();
      $("#span_confirm_new_password").remove();
      $("#div_confirm_new_password").closest("div").removeClass("has-error");
      div.addClass("has-error");
      div.append('<span id="span_new_password" class="help-block">Le mot de passe doit faire au moins 6 caractères et contenir 1 majuscule, 1 minuscule, et 1 chiffre !</span>');
      return false;
    }
    var div = $("#div_confirm_new_password").closest("div");
    $("#span_current_password").remove();
    $("#span_new_password").remove();
    $("#span_confirm_new_password").remove();
    $("#div_new_password").closest("div").removeClass("has-error");
    div.addClass("has-error");
    div.append('<span id="span_confirm_new_password" class="help-block">Les 2 mots de passe ne correspondent pas !</span>');
    return false;
  }
  document.forms["change_password_form"].submit();
  return true;
}
