function display_notif(courses, nb_course, count) {
  if (nb_course == 0 && count == 0) {
    var text_no_current_course = document.createElement('p'); //message pas de courses en cours
    text_no_current_course.setAttribute('id', 'text_no_current_course');
    text_no_current_course.setAttribute('class', 'regular_dark_openSans');
    text_no_current_course.setAttribute('style', 'font-size: 13px; padding: 20px; border-bottom: 1px solid #D8D8D8;');

    var text = document.createTextNode('Pas de courses en cours.');
    text_no_current_course.appendChild(text);
    document.getElementById('courses_block').appendChild(text_no_current_course);
  }
  else if (nb_course != 0 && count == 0) {
    for (i = 0; i < nb_course; i++) {
      var current_course = document.createElement('div'); // div contenant toute la course
      if (i == nb_course - 1) {
        current_course.setAttribute('style', 'margin-bottom: 10px;');
      }
      current_course.setAttribute('id', 'course_' + (i + 1));
      current_course.setAttribute('class', 'col-xs-12 col-md-12 no_padding_div notif_current_course separator_notif');
      document.getElementById('courses_block').appendChild(current_course);

      var block1 = document.createElement('div');
      block1.setAttribute('id', 'course_' + (i + 1) + '_block1');
      block1.setAttribute('align', 'left');
      block1.setAttribute('class', 'col-xs-12 col-md-12 no_padding_div');
      block1.setAttribute('style', 'padding: 10px; padding-bottom: 5px;');
      document.getElementById('course_' + (i + 1)).appendChild(block1);

      var infos_course = courses[i].refcourse + " - " + courses[i].time.day + '/' + courses[i].time.month + '/' + courses[i].time.year;

      var input_info = document.createElement('input'); //ref course
      input_info.setAttribute('id', 'infos_course_' + (i + 1));
      input_info.setAttribute('value', infos_course);
      input_info.setAttribute('name', 'ref_course_' + (i + 1));
      input_info.setAttribute('disabled', 'disabled');
      input_info.setAttribute('class', 'notif_input bold_dark_montSerra');
      input_info.setAttribute('style', 'font-size: 13px;');
      document.getElementById('course_' + (i + 1) + '_block1').appendChild(input_info);

      var block2 = document.createElement('div'); // contient la div des step
      block2.setAttribute('id', 'course_' + (i + 1) + '_block2');
      block2.setAttribute('class', 'col-xs-12 col-md-12 no_padding_div');
      document.getElementById('course_' + (i + 1)).appendChild(block2);

      var div_step1 = document.createElement('div');
      div_step1.setAttribute('id', 'course_' + (i + 1) + '_step1');
      div_step1.setAttribute('class', 'col-xs-2 col-md-2 no_padding_div');
      document.getElementById('course_' + (i + 1) + '_block2').appendChild(div_step1);

      var div_step2 = document.createElement('div');
      div_step2.setAttribute('id', 'course_' + (i + 1) + '_step2');
      div_step2.setAttribute('class', 'col-xs-2 col-md-2 no_padding_div');
      document.getElementById('course_' + (i + 1) + '_block2').appendChild(div_step2);

      var div_step3 = document.createElement('div');
      div_step3.setAttribute('id', 'course_' + (i + 1) + '_step3');
      div_step3.setAttribute('class', 'col-xs-2 col-md-2 no_padding_div');
      document.getElementById('course_' + (i + 1) + '_block2').appendChild(div_step3);

      var div_step4 = document.createElement('div');
      div_step4.setAttribute('id', 'course_' + (i + 1) + '_step4');
      div_step4.setAttribute('class', 'col-xs-2 col-md-2 no_padding_div');
      document.getElementById('course_' + (i + 1) + '_block2').appendChild(div_step4);

      var step1 = document.createElement('img');
      step1.setAttribute('src', '../img/notifications/paiement_success_on.svg');
      step1.setAttribute('alt', 'payment validé');
      step1.setAttribute('id', 'img_paiement_success');
      step1.setAttribute('width', '45px');
      step1.setAttribute('height', '45px');
      document.getElementById('course_' + (i + 1) + '_step1').appendChild(step1);

      var step2 = document.createElement('img');
      step2.setAttribute('src', '../img/notifications/courier_accept_course_off.svg');
      step2.setAttribute('alt', 'course prise par un coursier');
      step2.setAttribute('id', 'img_courier_accept_course');
      step2.setAttribute('width', '45px');
      step2.setAttribute('height', '45px');
      document.getElementById('course_' + (i + 1) + '_step2').appendChild(step2);

      var step3 = document.createElement('img');
      step3.setAttribute('src', '../img/notifications/take_package_off.svg');
      step3.setAttribute('alt', 'Retrait');
      step3.setAttribute('id', 'img_take_package_progress');
      step3.setAttribute('width', '45px');
      step3.setAttribute('height', '45px');
      document.getElementById('course_' + (i + 1) + '_step3').appendChild(step3);

      var step4 = document.createElement('img');
      step4.setAttribute('src', '../img/notifications/delivery_success_off.svg');
      step4.setAttribute('alt', 'Livraison');
      step4.setAttribute('id', 'img_delivery_success');
      step4.setAttribute('width', '45px');
      step4.setAttribute('height', '35px');
      document.getElementById('course_' + (i + 1) + '_step4').appendChild(step4);

      if (courses[i].step == 1) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_progress.svg");
      }

      else if (courses[i].step == 2) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_progress.svg");
      }

      else if (courses[i].step == 3) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_on.svg");
        step4.setAttribute("src", "../img/notifications/delivery_success_progress.svg");
      }
      else if (courses[i].step == 4) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_on.svg");
        step4.setAttribute("src", "../img/notifications/delivery_success_on.svg");
      }


      var block3 = document.createElement('div'); // contient la div avec le bouton
      block3.setAttribute('id', 'course_' + (i + 1) + '_block3');
      block3.setAttribute('class', 'col-xs-3 col-md-3 no_padding_div');
      block3.setAttribute('align', 'right');
      document.getElementById('course_' + (i + 1) + '_block2').appendChild(block3);

      var link_see_course = document.createElement('a'); // entoure le bouton
      link_see_course.setAttribute('id', 'course' + (i + 1) + '_link_see_course');
      link_see_course.setAttribute('class', 'hidden_link');
      link_see_course.setAttribute('href', '/trackorder/'+ courses[i].refcourse);
      document.getElementById('course_' + (i + 1) + '_block3').appendChild(link_see_course);

      var btn_see_course = document.createElement('input'); // bouton permettant d'acceder au tracking de la course
      btn_see_course.setAttribute('id', 'course' + (i + 1) + '_btn_see_course');
      btn_see_course.setAttribute('type', 'submit');
      btn_see_course.setAttribute('class', 'btn btn_see_course');
      btn_see_course.setAttribute('value', 'Voir');
      btn_see_course.setAttribute('href', '/trackorder/'+ courses[i].refcourse);
      document.getElementById('course' + (i + 1) + '_link_see_course').appendChild(btn_see_course);
    }
  }
  else {
    step1 = document.getElementById('img_paiement_success');
    step2 = document.getElementById('img_courier_accept_course');
    step3 = document.getElementById('img_take_package_progress');
    step4 = document.getElementById('img_delivery_success');
    for (i = 0; i < nb_course; i++) {
      if (courses[i].step == 1) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_progress.svg");
      }

      else if (courses[i].step == 2) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_progress.svg");
      }

      else if (courses[i].step == 3) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_on.svg");
        step4.setAttribute("src", "../img/notifications/delivery_success_progress.svg");
      }
      else if (courses[i].step == 4) {
        step2.setAttribute("src", "../img/notifications/courier_accept_course_on.svg");
        step3.setAttribute("src", "../img/notifications/take_package_on.svg");
        step4.setAttribute("src", "../img/notifications/delivery_success_on.svg");
      }
    }
  }
}
