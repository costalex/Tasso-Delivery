var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');
var ejs = require('ejs');

var pricesignature = 4.5;
var pricecode = 6.5;

var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@tassodelivery.com',
    pass: '12Omede@51!'
  }
});

var Logo = path.join('file:/', __dirname, '../public/img/logo_tasso.svg')
var css = path.join('file:/', __dirname, '../invoice/template/style.css')

exports.GenInvoiceCourseStripe = function(req, res, user, course, title, type , callback) {
  //title = invoice or reçu
  //calcule des montant de la facture
  var Puht= course.details.price;
  var Quantite= 1;
  var remise = user.wallet.balance/1.2;
  var Montantht= Puht * Quantite;
  var Netht = Montantht - remise;
  var Tva = (Netht * 20)/100;
  var Secure_Quantite ="";
  var Secure_designation= "";
  var Secure_PuHt="";
  var Secure_Montantht= "";
  if (course.security.option == 1)
  {
  Puht= course.details.price - pricecode;
  Secure_designation = "Remise contre code sécurisé";
  Secure_Quantite= 1;
  Secure_PuHt= pricecode;
  Secure_Montantht= Secure_PuHt * Secure_Quantite;
  }
  if (course.security.option == 2)
  {
    Puht= course.details.price - pricesignature;
    Secure_designation = "Remise contre signature";
    Secure_Quantite= 1;
    Secure_PuHt= pricesignature;
    Secure_Montantht= Secure_PuHt * Secure_Quantite;
  }
  //header
  var data = {
    refacture: course.link.refcourse,
    date: {day: course.details.validatetime.getDate(),
      month: course.details.validatetime.getMonth()+1,
      year: course.details.validatetime.getFullYear()},
      NumClient: user._id,
      details : user.details,
      //body
      designation: type,
      Quantite: 1,
      Puht: Math.round(Puht*100)/100,
      Montantht: Math.round(Puht*100)/100 * Quantite,

      //footer

      remise : Math.round(remise*100)/100,
      Netht : Math.round(Montantht*100)/100 - remise,
      Tva : Math.round(((Math.round(Netht*100)/100 * 20)/100)*100)/100,
      Ttc : Math.round(Netht*100)/100 + Math.round(Tva*100)/100,

      Secure_designation : Secure_designation,
      Secure_Quantite: Secure_Quantite,
      Secure_PuHt: Secure_PuHt,
      Secure_Montantht: Secure_Montantht,
    }
    //Fin des calcule de la facture
    ejs.renderFile('./invoice/template/template-invoice.ejs', {data}, function(err, result) {
      // render on success
      if (result) {
        html = result;
        html = html.replace('{{Logo}}', Logo);
        html = html.replace('{{base}}', css);
        var options = { filename: title + '_' + course.link.refcourse+'.pdf', base: 'file:/'+ __dirname+ '../invoice/template/',
        format: 'A4', orientation: 'portrait', directory: 'invoice/pdf',type: "pdf" };
        pdf.create(html, options).toFile('invoice/pdf/'+title + '_' + course.link.refcourse+'.pdf',function(err, res) {
          var mailOptions = {
            from: 'Tasso <noreply@tassodelivery.com>',
            to: user.details.email,
            subject: 'Votre ' + title +': '+ title +'_'+ course.link.refcourse,
            text: "Bonjour,\nVous trouverez ci-joint votre facture correspondant à la course: "+course.link.refcourse + "\n\nMerci de votre commande, \nL' équipe Tasso",
            attachments: [{
              filename: title + '_' + course.link.refcourse+'.pdf',
              path: './invoice/pdf/'+ title + '_' + course.link.refcourse+'.pdf',
              contentType: 'application/pdf'
            }]
          }

          smtpTransport.sendMail(mailOptions, function(error, response){
            var mailOptions = {
              from: 'Invoice <noreply@tassodelivery.com>',
              to: 'invoice-backup@tassodelivery.com',
              subject: title +': '+ title +'_'+ course.link.refcourse,
              text:"De: "+course.link.iduser + ",\nfacture correspondant à la course: "+course.link.refcourse,
              attachments: [{
                filename: title + '_' + course.link.refcourse+'.pdf',
                path: './invoice/pdf/'+ title + '_' + course.link.refcourse+'.pdf',
                contentType: 'application/pdf'
              }]
            }
            smtpTransport.sendMail(mailOptions, function(error, response){
            });
          });
        })
        callback(true);
      }
      // render or error
      else {
        callback(false);
      }
    });
  }

  exports.GenInvoiceForfait = function(req, res, user, packageuser, title, type, callback) { //title = invoice or reçu
    //calcule des montant de la facture

    //header
    var Puht= (packageuser.details.value) / 1.2;
    var Quantite= 1;
    var remise = (packageuser.details.value - packageuser.details.price)/1.2;
    var Montantht= Puht * Quantite;
    var Netht = Montantht - remise;
    var Tva = (Netht * 20)/100;

    var data = {
      refacture: packageuser.refpackage,
      date: {day: packageuser.time.getDate(),
        month: packageuser.time.getMonth()+1,
        year: packageuser.time.getFullYear()},
        NumClient: user._id,
        details : user.details,
        //body
        designation: type,
        Quantite: 1,
        Puht: Math.round(Puht*100)/100,
        Montantht: Math.round(Puht*100)/100 * Quantite,

        //footer

        remise : Math.round(remise*100)/100,
        Netht : Math.round((Math.round(Montantht*100)/100 - remise)*100)/100,
        Tva : Math.round(((Math.round(Netht*100)/100 * 20)/100)*100)/100,
        Ttc : Math.round(Netht*100)/100 + Math.round(Tva*100)/100,
      }
      //Fin des calcule de la facture
      ejs.renderFile('./invoice/template/template-invoice.ejs', {data}, function(err, result) {
        // render on success
        if (result) {
          html = result;
          html = html.replace('{{Logo}}', Logo);
          html = html.replace('{{css}}', css);
          var options = { filename: title + '_' + packageuser.refpackage+'.pdf',  base: 'file:/'+ __dirname+ '../invoice/template/',
          format: 'A4', orientation: 'portrait', directory: 'invoice/pdf',type: "pdf" };
          pdf.create(html, options).toFile('invoice/pdf/'+title + '_' + packageuser.refpackage+'.pdf',function(err, res) {
            var mailOptions = {
              from: 'Tasso <noreply@tassodelivery.com>',
              to: user.details.email,
              subject: 'Votre ' + title +': '+ title +'_'+ packageuser.refpackage,
              text: "Bonjour,\nVous trouverez ci-joint votre facture correspondant à l\'achat du forfait "+packageuser.details.name +" avec le numéro: "+packageuser.refpackage + "\n\nMerci de votre commande, \nL'équipe Tasso",
              attachments: [{
                filename: title + '_' + packageuser.refpackage+'.pdf',
                path: './invoice/pdf/'+ title + '_' + packageuser.refpackage+'.pdf',
                contentType: 'application/pdf'
              }]
            }

            smtpTransport.sendMail(mailOptions, function(error, response){
              var mailOptions = {
                from: 'Invoice <noreply@tassodelivery.com>',
                to: 'invoice-backup@tassodelivery.com',
                subject: 'Votre ' + title +': '+ title +'_'+ packageuser.refpackage,
                text:"De: "+packageuser.iduser + ",\nfacture correspondant à l\'achat du forfait "+packageuser.details.name +" avec le numéro: "+packageuser.refpackage,
                attachments: [{
                  filename: title + '_' + packageuser.refpackage+'.pdf',
                  path: './invoice/pdf/'+ title + '_' + packageuser.refpackage+'.pdf',
                  contentType: 'application/pdf'
                }]
              }
              smtpTransport.sendMail(mailOptions, function(error, response){
              });
            });
          })
          callback(true);
        }
        // render or error
        else {
          callback(false);
        }
      });
    }

    exports.GenReceip = function(req, res, user, course, title, type, callback) { //title = invoice or reçu
      //calcule des montant de la facture

      //header
      var Puht = course.details.price
      var Secure_Quantite ="";
      var Secure_designation= "";
      var Secure_PuHt="";
      var Secure_Montantht= "";
      if (course.security.option == 1)
      {
      Puht = course.details.price - pricecode;
      Secure_designation = "Remise contre code sécurisé";
      Secure_Quantite= 1;
      Secure_Montantht= pricecode;
      }
      if (course.security.option == 2)
      {
        Puht = course.details.price - pricesignature;
        Secure_designation = "Remise contre signature";
        Secure_Quantite= 1;
        Secure_Montantht= pricesignature;
      }
      var data = {
        refacture: course.link.refcourse,
        date: {day: course.details.validatetime.getDate(),
          month: course.details.validatetime.getMonth()+1,
          year: course.details.validatetime.getFullYear()},
          details : user.details,
          //body
          designation: type,
          Quantite: 1,
          price: course.details.price,

          montantht: Math.round(Puht*100)/100,

          Secure_designation : Secure_designation,
          Secure_Quantite: Secure_Quantite,
          Secure_Montantht: Secure_Montantht,
          //footer
          start: Math.round(user.wallet.balance*100)/100 + course.details.price*1.2,
          end:  Math.round(user.wallet.balance*100)/100 ,
        }
        //Fin des calcule de la facture
        ejs.renderFile('./invoice/template/template-receipt.ejs', {data}, function(err, result) {
          // render on success
          if (result) {
            html = result;
            html = html.replace('{{Logo}}', Logo);
            var options = { filename: title + '_' + course.link.refcourse+'.pdf',
            format: 'A4', orientation: 'portrait', directory: 'invoice/pdf',type: "pdf" };
            pdf.create(html, options).toFile('invoice/pdf/'+title + '_' + course.link.refcourse+'.pdf',function(err, res) {

              var mailOptions = {
                from: 'Tasso <noreply@tassodelivery.com>',
                to: user.details.email,
                subject: 'Votre ' + title +': '+ title +'_'+ course.link.refcourse,
                text: "Bonjour,\nVous trouverez ci-joint votre reçu correspondant à la course: "+course.link.refcourse + "\n\nMerci de votre commande, \nL'équipe Tasso",
                attachments: [{
                  filename: title + '_' + course.link.refcourse+'.pdf',
                  path: './invoice/pdf/'+ title + '_' + course.link.refcourse+'.pdf',
                  contentType: 'application/pdf'
                }]
              }

              smtpTransport.sendMail(mailOptions, function(error, response){
                //console.log("Error mail 1", error);
                var mailOptions = {
                  from: 'Invoice <noreply@tassodelivery.com>',
                  to: 'invoice-backup@tassodelivery.com',
                  subject: 'Votre ' + title +': '+ title +'_'+ course.link.refcourse,
                  text:"De: "+course.link.iduser + ",\nreçu correspondant à la course: "+course.link.refcourse,
                  attachments: [{
                    filename: title + '_' + course.link.refcourse+'.pdf',
                    path: './invoice/pdf/'+ title + '_' + course.link.refcourse+'.pdf',
                    contentType: 'application/pdf'
                  }]
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                    //console.log("Error mail 2", error);
                });
              });
            })
            callback(true);
          }
          // render or error
          else {
            callback(false);
          }
        });
      }
