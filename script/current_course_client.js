function tabdynamique (s, s_length, div) {
  s = s.replace(/&#34;/g, '\"')
  commandeactif = JSON.parse(s);
  var nb_course = s_length;
  if (nb_course > 20) {
    nb_course = 20;
  }

  if (nb_course == 0) {
    var div_no_current_course = document.createElement('div'); //div contenant message + boutton pour commander
    div_no_current_course.setAttribute('id', 'div_no_current_course_' + div);
    div_no_current_course.setAttribute('class', 'col-sm-12 col-md-12');
    div_no_current_course.setAttribute('align', 'center');

    var div2 = $('#' + div).closest("div");
    div2.addClass("no_current_course");

    document.getElementById(div).appendChild(div_no_current_course);

    var text_no_current_course = document.createElement('p'); //message pas de courses en cours
    text_no_current_course.setAttribute('id', 'text_no_current_course');
    text_no_current_course.setAttribute('class', 'regular_dark_openSans');
    text_no_current_course.setAttribute('style', 'font-size: 14px;');

    if (div == "current_perso") {
      var text = document.createTextNode('Pas de courses en cours.');
      text_no_current_course.appendChild(text);
      document.getElementById('div_no_current_course_' + div).appendChild(text_no_current_course);

      var link_order = document.createElement('a');
      link_order.setAttribute('id', 'no_current_course_link_order');
      link_order.setAttribute('class', 'hidden_link');
      link_order.setAttribute('href', '/accueil');
      document.getElementById('div_no_current_course_' + div).appendChild(link_order);

      var order_course_btn = document.createElement('input'); //div boutton de commande
      order_course_btn.setAttribute('id', 'order_course_btn');
      order_course_btn.setAttribute('type', 'button');
      order_course_btn.setAttribute('class', 'btn btn_order');
      order_course_btn.setAttribute('value', 'Organiser une course');
      document.getElementById('no_current_course_link_order').appendChild(order_course_btn);
    }
    else {
      var text = document.createTextNode('Pas de courses terminées.');
      text_no_current_course.appendChild(text);
      document.getElementById('div_no_current_course_' + div).appendChild(text_no_current_course);

      var link_order = document.createElement('a');
      link_order.setAttribute('id', 'no_ended_course_link_order');
      link_order.setAttribute('class', 'hidden_link');
      link_order.setAttribute('href', '/accueil');
      document.getElementById('div_no_current_course_' + div).appendChild(link_order);

      var order_course_btn = document.createElement('input'); //div boutton de commande
      order_course_btn.setAttribute('id', 'order_course_btn');
      order_course_btn.setAttribute('type', 'button');
      order_course_btn.setAttribute('class', 'btn btn_order');
      order_course_btn.setAttribute('value', 'Organiser une course');
      document.getElementById('no_ended_course_link_order').appendChild(order_course_btn);
    }
  }
  else {
    for (i = 0; i < nb_course; i++) {
      var option = commandeactif[i].option;
      var current_course = document.createElement('div');  //div contenant toute la course
      current_course.setAttribute('id', 'course_' + div + (i + 1));
      if (i + 1 < nb_course) {
        current_course.setAttribute('class', 'col-sm-12 col-md-12 div_current_course separator_div');
      }
      else {
        current_course.setAttribute('class', 'col-sm-12 col-md-12 div_current_course');
      }
      document.getElementById(div).appendChild(current_course);

      var block1 = document.createElement('div');  //div bock1
      block1.setAttribute('id', div + '_course_' + (i + 1) + '_block1');
      block1.setAttribute('class', 'col-sm-4 col-md-4');
      document.getElementById('course_' + div + (i + 1)).appendChild(block1);

      var date = (commandeactif[i].time.day + '-' + commandeactif[i].time.month + '-' + commandeactif[i].time.year);
      var hour = (commandeactif[i].time.hour + ':' + commandeactif[i].time.minute);

      var input_timestamp = document.createElement('input'); //input timestamp
      input_timestamp.setAttribute('id', 'timestamp_startCourse_' + (i + 1));
      input_timestamp.setAttribute('value', 'Le ' + date + ' à ' + hour);
      input_timestamp.setAttribute('name', 'timestamp_startCourse_' + (i + 1));
      input_timestamp.setAttribute('disabled', 'disabled');
      input_timestamp.setAttribute('class', 'input_current_course bold_dark_montSerra');
      input_timestamp.setAttribute('style', 'font-size: 14px;');
      document.getElementById(div + '_course_' + (i + 1) + '_block1').appendChild(input_timestamp);

      var input_reference = document.createElement('input'); //input reference
      input_reference.setAttribute('id', 'ref_course' + (i + 1));
      input_reference.setAttribute('value', commandeactif[i].refcourse);
      input_reference.setAttribute('name', 'ref_course_' + (i + 1));
      input_reference.setAttribute('disabled', 'disabled');
      input_reference.setAttribute('class', 'input_current_course regular_dark_montSerra');
      input_reference.setAttribute('style', 'font-size: 14px;');
      document.getElementById(div + '_course_' + (i + 1) + '_block1').appendChild(input_reference);

      if (option == 1) {
        var div_option = document.createElement('div'); //div contenant image d'option de livraison + texte associe
        div_option.id = div + '_course' + (i + 1) + '_div_option';
        div_option.setAttribute('class', 'input-group input_padding');
        document.getElementById(div + '_course_' + (i + 1) + '_block1').appendChild(div_option);

        var span_option = document.createElement('span') // cree le span qui va contenir l'image
        span_option.setAttribute('id', div + '_course' + (i + 1) + '_span_option');
        span_option.setAttribute('class', 'no-border');
        document.getElementById(div + '_course' + (i + 1) + '_div_option').appendChild(span_option);

        var img_option = document.createElement('img'); //logo de l'option signature
        img_option.setAttribute('id', 'course' + (i + 1) + '_img_option');
        img_option.setAttribute('width', '15px');
        img_option.setAttribute('height', '15px');
        img_option.setAttribute('src', 'img/order/secure_code_option.svg');
        img_option.setAttribute('name', 'secure_code_option');
        img_option.setAttribute('alt', 'secure_code_option');
        document.getElementById(div + '_course' + (i + 1) + '_span_option').appendChild(img_option);

        var input_option = document.createElement('input'); //texte decrivant l'option
        input_option.setAttribute('class', 'input_current_course regular_dark_openSans');
        input_option.setAttribute('style', 'font-size: 12px; width: 130px; padding-left: 5px;');
        input_option.setAttribute('type', 'text');
        input_option.setAttribute('value', 'Remise contre code');
        input_option.setAttribute('id', 'course' + (i + 1) + '_option_course');
        input_option.setAttribute('name', 'option_course');
        input_option.setAttribute('disabled', 'disabled');
        document.getElementById(div + '_course' + (i + 1) + '_span_option').appendChild(input_option);
      }

      else if (option == 2) {
        var div_option = document.createElement('div'); //div contenant image d'option de livraison + texte associe
        div_option.id = div + '_course' + (i + 1) + '_div_option';
        div_option.setAttribute('class', 'input-group input_padding');
        document.getElementById(div + '_course_' + (i + 1) + '_block1').appendChild(div_option);

        var span_option = document.createElement('span') // cree le span qui va contenir l'image
        span_option.setAttribute('id', div + '_course' + (i + 1) + '_span_option');
        span_option.setAttribute('class', 'no-border');
        document.getElementById(div + '_course' + (i + 1) + '_div_option').appendChild(span_option);

        var img_option = document.createElement('img'); //logo de l'option signature
        img_option.setAttribute('id', 'course' + (i + 1) + '_img_option');
        img_option.setAttribute('width', '15px');
        img_option.setAttribute('height', '15px');
        img_option.setAttribute('src', 'img/order/signature_option.svg');
        img_option.setAttribute('name', 'signature_option');
        img_option.setAttribute('alt', 'signature_option');
        document.getElementById(div + '_course' + (i + 1) + '_span_option').appendChild(img_option);

        var input_option = document.createElement('input'); //texte decrivant l'option
        input_option.setAttribute('class', 'input_current_course regular_dark_openSans');
        input_option.setAttribute('style', 'font-size: 12px; width: 150px; padding-left: 5px;');
        input_option.setAttribute('type', 'text');
        input_option.setAttribute('value', 'Remise contre signature');
        input_option.setAttribute('id', 'course' + (i + 1) + '_option_course');
        input_option.setAttribute('name', 'option_course');
        input_option.setAttribute('disabled', 'disabled');
        document.getElementById(div + '_course' + (i + 1) + '_span_option').appendChild(input_option);
      }

      var block2 = document.createElement('div');  //div bock2
      block2.setAttribute('id', div + '_course_' + (i + 1) + '_block2');
      block2.setAttribute('class', 'col-sm-5 col-md-5');
      block2.setAttribute('align', 'left');
      block2.setAttribute('style', 'padding-top: 20px; padding-bottom: 15px;');
      document.getElementById('course_' + div + (i + 1)).appendChild(block2);

      var div_sender_address = document.createElement('div'); //div contenant icon + addresse de retrait
      div_sender_address.setAttribute('id', div + '_course_' + (i + 1) + '_div_sender_address');
      div_sender_address.setAttribute('class', 'input-group input_padding');
      document.getElementById(div + '_course_' + (i + 1) + '_block2').appendChild(div_sender_address);

      var span_logo_sender_address = document.createElement('span') //cree le span qui va contenir logo + adresse de retrait
      span_logo_sender_address.setAttribute('id', div + '_course_' + (i + 1) + '_logo_sender_address');
      span_logo_sender_address.setAttribute('class', 'no-border');
      document.getElementById(div + '_course_' + (i + 1) + '_div_sender_address').appendChild(span_logo_sender_address);

      var img_logo_sender_address = document.createElement('img'); //logo adresse de retrait
      img_logo_sender_address.setAttribute('id', div + '_course_' + (i + 1) + '_logo_sender_address');
      img_logo_sender_address.setAttribute('src', 'img/order/sender_address.svg');
      img_logo_sender_address.setAttribute('name', 'sender_address');
      img_logo_sender_address.setAttribute('alt', 'sender_address');
      document.getElementById(div + '_course_' + (i + 1) + '_logo_sender_address').appendChild(img_logo_sender_address);

      var input_sender_address = document.createElement('input'); //adresse de retrait
      input_sender_address.setAttribute('class', 'input_current_course regular_dark_openSans');
      input_sender_address.setAttribute('style', 'font-size: 12px; width: 245px;');
      input_sender_address.setAttribute('type', 'text');
      input_sender_address.setAttribute('value', commandeactif[i].startaddress);
      input_sender_address.setAttribute('id', div + '_course_' + (i + 1) + '_sender_address');
      input_sender_address.setAttribute('name', 'input_sender_address');
      input_sender_address.setAttribute('disabled', 'disabled');
      document.getElementById(div + '_course_' + (i + 1) + '_div_sender_address').appendChild(input_sender_address);

      var div_recipient_address = document.createElement('div'); //div contenant icon + addresse de livraison
      div_recipient_address.setAttribute('id', div + '_course_' + (i + 1) + '_div_recipient_address');
      div_recipient_address.setAttribute('class', 'input-group input_padding');
      document.getElementById(div + '_course_' + (i + 1) + '_block2').appendChild(div_recipient_address);


      var span_logo_recipient_address = document.createElement('span') //cree le span qui va contenir logo + adresse de livraison
      span_logo_recipient_address.setAttribute('id', div + '_course_' + (i + 1) + '_logo_recipient_address');
      span_logo_recipient_address.setAttribute('class', 'no-border');
      document.getElementById(div + '_course_' + (i + 1) + '_div_recipient_address').appendChild(span_logo_recipient_address);

      var img_logo_recipient_address = document.createElement('img'); //logo adresse de livraison
      img_logo_recipient_address.setAttribute('id', 'course' + (i + 1) + '_logo_recipient_address');
      img_logo_recipient_address.setAttribute('src', 'img/order/recipient_address.svg');
      img_logo_recipient_address.setAttribute('name', 'recipient_address');
      img_logo_recipient_address.setAttribute('alt', 'recipient_address');
      document.getElementById(div + '_course_' + (i + 1) + '_logo_recipient_address').appendChild(img_logo_recipient_address);

      var input_recipient_address = document.createElement('input'); //adresse de retrait
      input_recipient_address.setAttribute('class', 'input_current_course regular_dark_openSans');
      input_recipient_address.setAttribute('style', 'font-size: 12px; width: 245px;');
      input_recipient_address.setAttribute('type', 'text');
      input_recipient_address.setAttribute('value', commandeactif[i].endaddress);
      input_recipient_address.setAttribute('id', 'course' + (i + 1) + '_recipient_address');
      input_recipient_address.setAttribute('name', 'input_recipient_address');
      input_recipient_address.setAttribute('disabled', 'disabled');
      document.getElementById(div + '_course_' + (i + 1) + '_div_recipient_address').appendChild(input_recipient_address);

      var block3 = document.createElement('div');  //div bock3
      block3.setAttribute('id', div + '_course_' + (i + 1) + '_block3');
      block3.setAttribute('class', 'col-sm-3 col-md-3');
      block3.setAttribute('align', 'right');
      if (div == "ended_perso") {
        block3.setAttribute('style', 'padding-bottom: 10px;');
      }
      document.getElementById('course_' + div + (i + 1)).appendChild(block3);

      var div_step = document.createElement('div');
      div_step.setAttribute('id', div + '_course_' + (i + 1) + '_div_step');
      div_step.setAttribute('class', 'col-sm-4 col-md-4');
      div_step.setAttribute('align', 'left');
      div_step.setAttribute('style', 'position: relative;');
      document.getElementById(div + '_course_' + (i + 1) + '_block3').appendChild(div_step);

      var step_course = document.createElement('img');
      step_course.setAttribute('id', 'course' + (i + 1) + '_logo_step_course');
      step_course.setAttribute('src', '../img/notifications/courier_accept_course_progress.svg');
      step_course.setAttribute('width', '70px');
      step_course.setAttribute('height', '70px');
      step_course.setAttribute('name', 'step_course');
      step_course.setAttribute('alt', 'step_course');
      step_course.setAttribute('style', 'position: absolute; margin-top: 15px;');
      document.getElementById(div + '_course_' + (i + 1) + '_div_step').appendChild(step_course);


      if (commandeactif[i].step == 1) {
        step_course.setAttribute("src", "../img/notifications/courier_accept_course_progress.svg");
      }

      else if (commandeactif[i].step == 2) {
        step_course.setAttribute("src", "../img/notifications/take_package_progress.svg");
      }

      else if (commandeactif[i].step == 3) {
        step_course.setAttribute("src", "../img/notifications/delivery_success_progress.svg");
      }
      else if (commandeactif[i].step == 4) {
        step_course.setAttribute("src", "../img/notifications/delivery_success_on.svg");
        step_course.setAttribute('style', 'position: absolute; margin-top: 0px;');
        step_course.setAttribute('width', '60px');
        step_course.setAttribute('height', '60px');
        div_step.setAttribute('class', 'padding_step_4');
        div_step.setAttribute('style', 'position: relative; margin-top: 0px;');
      }

      var type_course = document.createElement('p'); // contient le type de course
      type_course.setAttribute('id', 'course' + (i + 1) + '_type_course');
      type_course.setAttribute('class', 'bold_blue_montSerra');
      type_course.setAttribute('style', 'font-size: 14px; margin-bottom: 0px;');
      type_course.setAttribute('type', 'text');
      type_course.setAttribute('name', 'type_course');
      document.getElementById(div + '_course_' + (i + 1) + '_block3').appendChild(type_course);
      var text_type_course = document.createTextNode('Course simple');
      type_course.appendChild(text_type_course);

      var price_course = document.createElement('p'); // contient le prix de la course
      price_course.setAttribute('id', 'course' + (i + 1) + '_price_course');
      price_course.setAttribute('class', 'input_current_course bold_dark_montSerra');
      price_course.setAttribute('style', 'font-size: 18px; margin-bottom: 0px; padding-bottom: 5px;');
      price_course.setAttribute('type', 'text');
      price_course.setAttribute('name', 'price_course');
      document.getElementById(div + '_course_' + (i + 1) + '_block3').appendChild(price_course);
      var text_type_course = document.createTextNode(commandeactif[i].price + '€');
      price_course.appendChild(text_type_course);

      if (div == 'current_perso') {
        var btn_div_see_course= document.createElement('div'); //div contenant le bouton pour voir la course
        btn_div_see_course.setAttribute('style', 'padding-right: 0px; padding-left: 0px;');
        btn_div_see_course.setAttribute('id', 'course' + (i + 1) + '_btn_div_see_course');
        btn_div_see_course.setAttribute('class', 'col-sm-12 col-md-12');
        btn_div_see_course.setAttribute('align', 'right');

        document.getElementById(div + '_course_' + (i + 1) + '_block3').appendChild(btn_div_see_course);

        var link_track_order = document.createElement('a'); // entoure le bouton
        link_track_order.setAttribute('id', 'course' + (i + 1) + '_link_track_order');
        link_track_order.setAttribute('class', 'hidden_link');
        link_track_order.setAttribute('href', '/trackorder/'+ commandeactif[i].refcourse);
        document.getElementById('course' + (i + 1) + '_btn_div_see_course').appendChild(link_track_order);


        var btn_see_course = document.createElement('input'); // bouton permettant d'acceder au tracking de la course
        btn_see_course.setAttribute('id', 'course' + (i + 1) + '_btn_see_course');
        btn_see_course.setAttribute('type', 'submit');
        btn_see_course.setAttribute('class', 'btn btn_see_details');
        btn_see_course.setAttribute('value', 'Voir');
        btn_see_course.setAttribute('href', '/trackorder/'+ commandeactif[i].refcourse);
        document.getElementById('course' + (i + 1) + '_link_track_order').appendChild(btn_see_course);
      }
    }
  }
}
