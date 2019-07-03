var crypto = require('crypto');
var rand = require('csprng');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");
var user = require('../config/models/user');
var verif = require('../config/verifinput');

var smtpTransport = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@tassodelivery.com',
    pass: '12Omede@51!'
  }
});

exports.cpass = function(id,opass,npass,callback) {

  var temp1 = rand(160, 36);
  var newpass1 = temp1 + npass;
  var hashed_passwordn = crypto.createHash('sha512').update(newpass1).digest("hex");

  user.find({"auth.token": id},function(err,users){

    if(users.length != 0){

      var temp = users[0].auth.salt;
      var hash_db = users[0].auth.password;
      var newpass = temp + opass;
      var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");


      if(hash_db == hashed_password){
        verif.checkvalue(npass, 'PASSWORD', function(res) {
          if (res == false)
          callback({'response':"Sécurité du nouveau mot de passe trop faible!",'res':false});
          else {
            user.findOne({ 'auth.token' : id }, function (err, doc){
              if (doc)
              {
                doc.auth.password = hashed_passwordn;
                doc.auth.salt = temp1;
                doc.save();

                callback({'response':"Mot de passe changé avec succès",'res':true});
              }
              else {
                callback({'response':"Erreur lors du changement de mot de passe",'res':false});
              }
            });
          }
        });
      }else{
        callback({'response':"L\'ancien mot de passe est incorrect!",'res':false});
      }
    }else{
      callback({'response':"Erreur lors du changement de mot de passe",'res':false});
    }

  });
}

exports.respass_init = function(email,callback) {

  var temp =rand(24, 24);
  user.find({'auth.email': email},function(err,users){

    if(users.length != 0){


      user.findOne({ 'auth.email': email }, function (err, doc){
        doc.auth.temp_str= temp;
        var min = Math.ceil(0);
        var max = Math.floor(9);
        var nb = Math.floor(Math.random() * (max - min +1)) + min;
        var npass = randomstring.generate(7) + nb;
        console.log(npass);
        var temp1 = rand(160, 36);
        var newpass1 = temp1 + npass;
        var hashed_password = crypto.createHash('sha512').update(newpass1).digest("hex");
        doc.auth.password= hashed_password;
        doc.auth.salt = temp1;
        doc.auth.temp_str = "";

        doc.save();

        var mailOptions = {
          from: 'TassoDelivery <noreply@tassodelivery.com>',
          to: email,
          subject: "Reset Password ",
          text: "Bonjour "+email+",\nVotre nouveau mot de passe est: "+npass+"\n\nCordialement,\nL'équipe Tasso.",

        }

        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            callback({'response':"Erreur lors du changement de mot de passe!", 'res': false});

          }else{

            callback({'response':"Un code de vérification vous a été envoyé par e-mail", 'res': true});

          }
        });
      });
    }else{

      callback({'response':"E-mail inconnu.", 'res': false});

    }
  });
}

exports.respass_chg = function(email,code,npass,callback) {


  user.find({'auth.email': email},function(err,users){

    if(users.length != 0){

      var temp = users[0].auth.temp_str;
      var temp1 =rand(160, 36);
      var newpass1 = temp1 + npass;
      var hashed_password = crypto.createHash('sha512').update(newpass1).digest("hex");

      if(temp == code){
        if (npass.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && npass.length > 5 && npass.match(/[0-9]/)) {
          user.findOne({ email: email }, function (err, doc){
            doc.auth.password= hashed_password;
            doc.auth.salt = temp1;
            doc.auth.temp_str = "";
            doc.save();

            callback({'response':"Mot de passe changé avec succès",'res':true});

          });}else{

            callback({'response':"Sécurité du nouveau mot de passe trop faible!",'res':false});

          }
        }else{

          callback({'response':"Code de vérification invalide!",'res':false});

        }
      }else{

        callback({'response':"Erreur",'res':true});

      }
    });
  }
