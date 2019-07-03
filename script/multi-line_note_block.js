$(document).ready(function() {
  var placeholder = "Ajouter une note :</br>Vos instructions de livraison.</br>Code interphone, numéro immeuble…</br>Toutes les informations sont utiles</br>pour une livraison parfaite.";
  if ($('#description_sender').val() == '') {
    $("#description-placeholder_sender").append(placeholder);
  }
  $('#description_sender').focus(function(){
    $("#description-placeholder_sender").html('');
  });
  $("#description-placeholder_sender").click(function() {
    $('#description_sender').focus();
  });
  $('#description_sender').blur(function(){
    if ($('#description_sender').val() == '') {
      $("#description-placeholder_sender").append(placeholder);
    }
  });
});

$(document).ready(function() {
  var placeholder_recipient = "Ajouter une note :</br>Vos instructions de livraison.</br>Code interphone, numéro immeuble…</br>Toutes les informations sont utiles</br>pour une livraison parfaite.";
  if ($('#description_recipient').val() == '') {
    $("#description-placeholder_recipient").append(placeholder_recipient);
  }
  $('#description_recipient').focus(function(){
    $("#description-placeholder_recipient").html('');
  });
  $("#description-placeholder_recipient").click(function() {
    $('#description_recipient').focus();
  });
  $('#description_recipient').blur(function(){
    if ($('#description_recipient').val() == '') {
      $("#description-placeholder_recipient").append(placeholder_recipient);
    }
  });
});
