function check_entreprise_infos() {
    var name = document.getElementById('entreprise_name').value;
    var siret = document.getElementById('entreprise_SIRET').value;
    var activity_sector = document.getElementById('entreprise_sector').value;
    var phone = document.getElementById('entreprise_phone').value;
    var address = document.getElementById('entreprise_address').value;
    var zipcode = document.getElementById('entreprise_address_zipcode').value;
    var city = document.getElementById('entreprise_address_city').value;
    var country = document.getElementById('entreprise_address_country').value;
    var email = document.getElementById('entreprise_email').value;

    var reg_ALPHA = /^(.*[;])$/
    var reg_NUMERIC = /^(.*[0-9])$/
    var reg_siret = /^[0-9]{14}$/
    var reg_phone = /^0[1-9]([ ]?[0-9]{2}){4}/
    var reg_mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (reg_ALPHA.test(name) == true) {
        var div = $("#create_entreprise_name").closest("div");
        var input = $("#entreprise_name").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_name" class="help-block">Nom de société invalide !</span>');
        return false;
    }
    if (!reg_siret.test(siret)) {
        var div = $("#create_entreprise_SIRET").closest("div");
        var input = $("#entreprise_SIRET").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_siret" class="help-block">SIRET invalide !</span>');
        return false;
    }
    if (reg_ALPHA.test(activity_sector) == true) {
        var div = $("#create_entreprise_sector").closest("div");
        var input = $("#entreprise_sector").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_activity_sector" class="help-block">Secteur invalide !</span>');
        return false;
    }
    if (!reg_phone.test(phone)) {
        var div = $("#create_entreprise_phone").closest("div");
        var input = $("#entreprise_phone").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_phone" class="help-block">Téléphone invalide !</span>');
        return false;
    }
    if (reg_ALPHA.test(address) == true || reg_NUMERIC.test(address) == true) {
        var div = $("#create_entreprise_address").closest("div");
        var input = $("#entreprise_address").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_address" class="help-block">Adresse invalide !</span>');
        return false;
    }
    if (!reg_NUMERIC.test(zipcode)) {
        var div = $("#create_entreprise_zipcode").closest("div");
        var input = $("#entreprise_address_zipcode").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_zipcode" class="help-block">Code postal invalide !</span>');
        return false;
    }
    if (reg_ALPHA.test(city) == true || reg_NUMERIC.test(city) == true) {
        var div = $("#create_entreprise_city").closest("div");
        var input = $("#entreprise_address_city").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_city" class="help-block">Ville invalide !</span>');
        return false;
    }
    if (reg_ALPHA.test(country) == true || reg_NUMERIC.test(country) == true) {
        var div = $("#create_entreprise_country").closest("div");
        var input = $("#entreprise_address_country").closest("input");
        clean_error_block();
        div.addClass("has-error");
        input.addClass("has-error");
        div.append('<span id="span_error_country" class="help-block">Pays invalide !</span>');
        return false;
    }
    if (email.length < 6 || email.length >= 6) {
      if (!reg_mail.test(email)) {
          var div = $("#create_entreprise_email").closest("div");
          var input = $("#entreprise_email").closest("input");
          clean_error_block();
          div.addClass("has-error");
          input.addClass("has-error");
          div.append('<span id="span_error_email" class="help-block">Email invalide !</span>');
          return false;
      }
    }
    return true;
}

function clean_error_block() {
    $('#entreprise_name').closest('input').removeClass('has-error');
    $('#entreprise_SIRET').closest('input').removeClass('has-error');
    $('#entreprise_sector').closest('input').removeClass('has-error');
    $('#entreprise_phone').closest('input').removeClass('has-error');
    $('#entreprise_address').closest('input').removeClass('has-error');
    $('#entreprise_address_zipcode').closest('input').removeClass('has-error');
    $('#entreprise_address_city').closest('input').removeClass('has-error');
    $('#entreprise_address_country').closest('input').removeClass('has-error');
    $('#entreprise_email').closest('input').removeClass('has-error');

    $("#span_error_name").remove();
    $("#span_error_siret").remove();
    $("#span_error_activity_sector").remove();
    $("#span_error_phone").remove();
    $("#span_error_address").remove();
    $("#span_error_zipcode").remove();
    $("#span_error_city").remove();
    $("#span_error_contry").remove();
    $("#span_error_email").remove();
}
