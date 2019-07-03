function updateStep(step) {
  var step1 = document.getElementById("track_img_paiement_success");
  var step2 = document.getElementById("track_img_courier_accept_course");
  var step3 = document.getElementById("track_img_take_package_progress");
  var step4 = document.getElementById("track_img_delivery_success");

  if (step == 1) {
    var text_courier_accept_course = document.getElementById('text_courier_accept_course');
    step2.setAttribute("src", "../img/notifications/courier_accept_course_progress.svg");
    text_courier_accept_course.innerHTML = 'Attente coursier.';
  }
  else if (step == 2) {
    step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
    var text_courier_accept_course = document.getElementById('text_courier_accept_course');
    text_courier_accept_course.innerHTML = 'Course acceptée.';

    step3.setAttribute("src", "../img/notifications/take_package_progress.svg");
    var text_take_package_progress = document.getElementById('text_take_package_progress');
    text_take_package_progress.innerHTML = 'Attente retrait.';
  }
  else if (step == 3) {
    step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
    step3.setAttribute("src", "../img/notifications/take_package_on.svg");
    var text_take_package_progress = document.getElementById('text_take_package_progress');
    var text_courier_accept_course = document.getElementById('text_courier_accept_course');
    text_courier_accept_course.innerHTML = 'Course acceptée.';
    text_take_package_progress.innerHTML = 'Retrait effectué.';

    step4.setAttribute("src", "../img/notifications/delivery_success_progress.svg");
    var text_delivery_success = document.getElementById('text_delivery_success');
    var text_take_package_progress = document.getElementById('text_take_package_progress');
    var text_courier_accept_course = document.getElementById('text_courier_accept_course');
    text_courier_accept_course.innerHTML = 'Course acceptée.';
    text_take_package_progress.innerHTML = 'Retrait effectué.';
    text_delivery_success.innerHTML = 'Attente livraison.';
  }
  else if (step == 4) {
    step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
    step3.setAttribute("src", "../img/notifications/take_package_on.svg");
    step4.setAttribute("src", "../img/notifications/delivery_success_on.svg");
    var text_delivery_success = document.getElementById('text_delivery_success');
    var text_take_package_progress = document.getElementById('text_take_package_progress');
    var text_courier_accept_course = document.getElementById('text_courier_accept_course');
    text_courier_accept_course.innerHTML = 'Course acceptée.';
    text_take_package_progress.innerHTML = 'Retrait effectué.';
    text_delivery_success.innerHTML = 'Livraison effectuée.';
    swal({
      title: 'Course terminée !',
      text: 'Vous allez être redirigé vers la page d\'accueil !',
      showConfirmButton: false,
      timer: 5000,
      onOpen: () => {
        swal.showLoading()
      }
    }).catch(swal.noop);
    setTimeout(function() {
      window.location = "/accueil";
    }, 5000);
  }
}
