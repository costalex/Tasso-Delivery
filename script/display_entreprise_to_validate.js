function list_entreprise(company_validate, nb_account) {
  if (nb_account == 0) {
    var div_no_account_to_validate = document.createElement('div');
    div_no_account_to_validate.setAttribute('id', 'div_no_account_to_validate');
    div_no_account_to_validate.setAttribute('class', 'col-sm-12 col-md-12');
    div_no_account_to_validate.setAttribute('align', 'center');
    div_no_account_to_validate.setAttribute('style', 'padding-top: 30px; padding-bottom: 20px;');
    document.getElementById('entreprise_account_validated').appendChild(div_no_account_to_validate);

    var no_account_to_validate = document.createElement('p');
    no_account_to_validate.setAttribute('id', 'no_account_to_validate');
    no_account_to_validate.setAttribute('class', 'regular_blue_openSans');
    no_account_to_validate.setAttribute('style', 'font-size: 16px;');
    document.getElementById('div_no_account_to_validate').appendChild(no_account_to_validate);

    var text = document.createTextNode('Aucun compte entreprise crée pour l\'instant !');
    no_account_to_validate.appendChild(text);
  }
  else {
    //console.log(company_validate, nb_account);
    var div_group_panel = document.createElement('div'); //div global contenant tous les pannels
    div_group_panel.setAttribute('id', 'accordion');
    div_group_panel.setAttribute('class', 'panel-group');
    document.getElementById('entreprise_account_validated').appendChild(div_group_panel);

    for (i = 0; i < nb_account; i++) {
      var panel = document.createElement('div'); //div contenant toutes les infos d'une entreprise - panel-default
      panel.setAttribute('id', 'panel_' + (i + 1));
      panel.setAttribute('class', 'panel panel-default');
      document.getElementById('accordion').appendChild(panel);

      var panel_heading = document.createElement('div'); // panel-heading
      panel_heading.setAttribute('id', 'panel_heading_' + (i + 1));
      panel_heading.setAttribute('class', 'panel-heading');
      document.getElementById('panel_' + (i + 1)).appendChild(panel_heading);

      var panel_title = document.createElement('h4'); //titre
      panel_title.setAttribute('id', 'panel_title_' + (i + 1));
      panel_title.setAttribute('class', 'panel-title regular_blue_openSans');
      panel_title.setAttribute('style', 'font-size: 17px;');
      // panel_title.setAttribute('onClick', 'collapseTab(id)');
      document.getElementById('panel_heading_' + (i + 1)).appendChild(panel_title);

      var collapse_link = document.createElement('a');
      collapse_link.setAttribute('data-toogle', 'collapse');
      collapse_link.setAttribute('href', '#collapse_' + (i + 1));
      document.getElementById('panel_title_' + (i + 1)).appendChild(collapse_link);

      var title = document.createTextNode(company_validate[i].details.firstname + ' - ' + company_validate[i].details.email + ' - ' + company_validate[i].details.phone);
      collapse_link.appendChild(title);

      var div_collapse = document.createElement('div');
      div_collapse.setAttribute('id', 'collapse_' + (i + 1));
      div_collapse.setAttribute('class', 'panel-collapse collapse in');
      document.getElementById('panel_' + (i + 1)).appendChild(div_collapse);

      var div_content = document.createElement('div'); // div contenant 2 blocs d'infos
      div_content.setAttribute('id', 'content_' + (i + 1));
      div_content.setAttribute('class', 'panel-body');
      document.getElementById('collapse_' + (i + 1)).appendChild(div_content);

      var div_infos_entreprise = document.createElement('div'); //div contentant les infos de l'entreprise
      div_infos_entreprise.setAttribute('id', 'infos_entreprise_' + (i + 1));
      div_infos_entreprise.setAttribute('class', 'col-sm-6 col-md-6 no_padding');
      document.getElementById('content_' + (i + 1)).appendChild(div_infos_entreprise);

      var div_siret = document.createElement('div');
      div_siret.setAttribute('id', 'div_siret_' + (i + 1));
      div_siret.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_entreprise_' + (i + 1)).appendChild(div_siret);

      var text_SIRET = document.createElement('p'); //titre
      text_SIRET.setAttribute('id', 'siret_' + (i + 1));
      text_SIRET.setAttribute('class', 'regular_dark_montSerra');
      text_SIRET.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_siret_' + (i + 1)).appendChild(text_SIRET);

      var SIRET = document.createTextNode("Numéro de SIRET: " + company_validate[i].details.siret);
      text_SIRET.appendChild(SIRET);

      var div_sector = document.createElement('div');
      div_sector.setAttribute('id', 'div_sector_' + (i + 1));
      div_sector.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_entreprise_' + (i + 1)).appendChild(div_sector);

      var text_sector = document.createElement('p'); //titre
      text_sector.setAttribute('id', 'sector_' + (i + 1));
      text_sector.setAttribute('class', 'regular_dark_montSerra');
      text_sector.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_sector_' + (i + 1)).appendChild(text_sector);

      var sector = document.createTextNode("Secteur d'activité: " + company_validate[i].details.sector);
      text_sector.appendChild(sector);

      var div_address = document.createElement('div');
      div_address.setAttribute('id', 'div_address_' + (i + 1));
      div_address.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_entreprise_' + (i + 1)).appendChild(div_address);

      var text_address = document.createElement('p'); //titre
      text_address.setAttribute('id', 'address_' + (i + 1));
      text_address.setAttribute('class', 'regular_dark_montSerra');
      text_address.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_address_' + (i + 1)).appendChild(text_address);

      var address = document.createTextNode("Adresse: " + company_validate[i].details.address);
      text_address.appendChild(address);

      var div_infos_admin = document.createElement('div'); // div contetenant les infos de l'admin du compte
      div_infos_admin.setAttribute('id', 'infos_admin_' + (i + 1));
      div_infos_admin.setAttribute('class', 'col-sm-6 col-md-6 div_infos_admin');
      document.getElementById('content_' + (i + 1)).appendChild(div_infos_admin);

      var infos_admin_title = document.createElement('h4'); //titre
      infos_admin_title.setAttribute('id', 'infos_admin_title_' + (i + 1));
      infos_admin_title.setAttribute('class', 'regular_dark_openSans h4_no_margin');
      infos_admin_title.setAttribute('style', 'font-size: 15px;');
      document.getElementById('infos_admin_' + (i + 1)).appendChild(infos_admin_title);

      var infos_admin = document.createTextNode("Administrateur du compte: ");
      infos_admin_title.appendChild(infos_admin);

      var div_name = document.createElement('div');
      div_name.setAttribute('id', 'div_name_' + (i + 1));
      div_name.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_admin_' + (i + 1)).appendChild(div_name);

      var name_admin = document.createElement('p'); //titre
      name_admin.setAttribute('id', 'name_admin_' + (i + 1));
      name_admin.setAttribute('class', 'regular_dark_montSerra');
      name_admin.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_name_' + (i + 1)).appendChild(name_admin);

      var text_name_admin = document.createTextNode("Prénom et nom: " + company_validate[i].detailsadmin.firstname + ' ' + company_validate[i].detailsadmin.lastname);
      name_admin.appendChild(text_name_admin);

      var div_phone = document.createElement('div');
      div_phone.setAttribute('id', 'div_phone_' + (i + 1));
      div_phone.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_admin_' + (i + 1)).appendChild(div_phone);

      var phone_admin = document.createElement('p'); //titre
      phone_admin.setAttribute('id', 'phone_admin_' + (i + 1));
      phone_admin.setAttribute('class', 'regular_dark_montSerra');
      phone_admin.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_phone_' + (i + 1)).appendChild(phone_admin);

      var text_phone_admin = document.createTextNode("Téléphone: " + company_validate[i].detailsadmin.phone);
      phone_admin.appendChild(text_phone_admin);

      var div_email = document.createElement('div');
      div_email.setAttribute('id', 'div_email_' + (i + 1));
      div_email.setAttribute('class', 'col-md-12 col-sm-12');
      document.getElementById('infos_admin_' + (i + 1)).appendChild(div_email);

      var email_admin = document.createElement('p'); //titre
      email_admin.setAttribute('id', 'email_admin_' + (i + 1));
      email_admin.setAttribute('class', 'regular_dark_montSerra');
      email_admin.setAttribute('style', 'font-size: 14px;');
      document.getElementById('div_email_' + (i + 1)).appendChild(email_admin);

      var text_email_admin = document.createTextNode("Email: " + company_validate[i].detailsadmin.email);
      email_admin.appendChild(text_email_admin);
    }
  }
}

  // function collapseTab(id_tab) {
//   console.log(id_tab);
//   id = id_tab.split("_").pop();
//   toCollapse = document.getElementById('collapse_' + id);
//   console.log(toCollapse);
//     if (toCollapse.className == "panel-collapse collapse") {
//       $('.collapse').collapse("show");
//     }
//     else if (toCollapse.className == "panel-collapse collapse in") {
//       $('.collapse').collapse("hide");
//     }
// }
