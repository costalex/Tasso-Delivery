var crypto = require('crypto');
var rand = require('csprng');
var mongoose = require('mongoose');
var gravatar = require('gravatar');
var User = require('../config/models/user');

exports.login = function(req, callback) {

  User.find({'auth.email': req.body.email},function(err,user){

    if (user.length == 1)
    {
      var temp = user[0].auth.salt;
      var hash_db = user[0].auth.password;
      var id = user[0].auth.token;
      var newpass = temp + req.body.password;
      var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
      var grav_url = gravatar.url(req.body.email, {s: '200', r: 'pg', d: '404'});
      if(hash_db == hashed_password){
        callback(user[0]);
      }else{
        req.flash('FailureLogin', "Erreur mot de passe");
        req.flash.type = 'error'
        callback(null);
      }
    }
    else {
      req.flash('FailureLogin', "Erreur e-mail");
      req.flash.type = 'error'
      callback(null);
    }
  });
}
