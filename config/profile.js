var chgpass = require('../config/chgpass');
var User = require('../config/models/user');
var verif = require('../config/verifinput');

verifemail = function(email, user2, callback) {
  if (email != null)
  {
    var x = email;
    if (!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length))
    {
      User.findOne({ 'auth.email' : email}, function(err, user) {
        if (err)
        return callback(false);
        // check to see if theres already a user with that email
        if (user && user2.auth.email != user.auth.email) {
            //console.log(user.auth.email, user2.auth.email);
            return callback(false);
        }
        else {
          return callback(true);
        }
      });
    }
    else {
      callback(false);
    }
  }
  else {
    callback(false);
  }
};

exports.edit_profile = function(req ,callback){
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    if (user != null) {
      verifemail(req.body.email, user, function(result)
      {
        if (result == true)
        {
          var x = req.body.email;
          if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length)){
            user.details.email = req.body.email;
            user.auth.email = req.body.email;
          }
          else {
            req.flash('FaillureProfile', "Bad email")
            return callback(false);
          }
        }
        if (req.body.address  != '' && req.body.address != undefined){
          user.details.address = req.body.address;}
          verif.checkvalue(req.body.lastname, 'ALPHANAME', function(res) {
            if (req.body.lastname  != '' && res == true && user.details.typeuser != 1){
              user.details.lastname    = req.body.lastname;}
              verif.checkvalue(req.body.firstname, 'ALPHANAME', function(res) {
                if (req.body.firstname != '' && res == true && user.details.typeuser != 1){
                  user.details.firstname   = req.body.firstname;}
                  verif.checkvalue(req.body.profesion, 'ALPHA', function(res) {
                    if (req.body.profesion  != '' && res == true){
                      user.details.profesion   = req.body.profesion;}
                      verif.checkvalue(req.body.phone, 'NUMERIC', function(res) {
                        if (req.body.phone  != '' && res == true && req.body.phone.length == 10){
                          User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
                            if (user.details.phone != req.body.phone)
                            {
                              user.save(function(err) {
                                if (err)
                                callback(false);
                                User.findOne({'details.phone' : req.body.phone},function(err,user2) {
                                  if (user2 && user2.auth.token != req.headers.token)
                                  {
                                    req.flash("Error", "Bab phone number");
                                    return callback(false);
                                  }
                                  else {
                                    user.details.phone = req.body.phone;
                                    user.save(function(err) {
                                      if (err){
                                        req.flash("Error", "Error save");
                                        callback(false);
                                      }
                                      callback(true);
                                    });
                                  }
                                });
                              });
                            }
                            else {
                              user.save(function(err) {
                                if (err)
                                callback(false);
                                callback(true);
                              });
                            }
                          });
                        }
                        else {
                          user.save(function(err) {
                            if (err)
                            callback(false);
                            callback(true);
                          });
                        }
                      });
                    });
                  });
                });
              });
            }
          });
        };

          exports.editprofile = function(req ,callback){
            User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
              if (user != null) {
                verifemail(req.body.email, user, function(result)
                {
                  if (result == false)
                  {
                    //console.log("email", result);
                    req.flash('Error', "E-mail incorrect")
                    return callback(false);
                  }
                  else {
                    var x = req.body.email;
                    if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length)){
                      user.details.email = req.body.email;
                      user.auth.email = req.body.email;
                    }
                  }
                  if (req.body.profile_address  != '' && req.body.profile_address != undefined){
                    user.details.address = req.body.profile_address;}
                    verif.checkvalue(req.body.lastname, 'ALPHANAME', function(res) {
                      if (req.body.lastname  != '' && res == true && user.details.typeuser != 1){
                        user.details.lastname    = req.body.lastname;}
                        verif.checkvalue(req.body.firstname, 'ALPHANAME', function(res) {
                          if (req.body.firstname != '' && res == true && user.details.typeuser != 1){
                            user.details.firstname   = req.body.firstname;}
                            verif.checkvalue(req.body.profesion, 'ALPHA', function(res) {
                              if (req.body.profesion  != '' && res == true){
                                user.details.profesion   = req.body.profesion;}
                                verif.checkvalue(req.body.phone, 'NUMERIC', function(res) {
                                  if (req.body.phone  != '' && res == true && req.body.phone.length == 10){
                                    User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
                                      if (user.details.phone != req.body.phone)
                                      {
                                        user.save(function(err) {
                                          if (err)
                                          callback(false);
                                          User.findOne({'details.phone' : req.body.phone},function(err,user2) {
                                            if (user2 && user2.auth.token != req.headers.token)
                                            {
                                              req.flash("Error", "Bab phone number");
                                              return callback(false);
                                            }
                                            else {
                                              user.details.phone = req.body.phone;
                                              user.save(function(err) {
                                                if (err){
                                                  req.flash("Error", "Error save");
                                                  callback(false);
                                                }
                                                callback(true);
                                              });
                                            }
                                          });
                                        });
                                      }
                                      else {
                                        user.save(function(err) {
                                          if (err)
                                          callback(false);
                                          callback(true);
                                        });
                                      }
                                    });
                                  }
                                  else {
                                    user.save(function(err) {
                                      if (err)
                                      callback(false);
                                      callback(true);
                                    });
                                  }
                                });
                              });
                            });
                          });
                        });
                      }
                    });
                  };

                    exports.edit_password = function(req , callback) {
                      User.findOne({'_id' : req.session.user_id},function(err,user) {
                        if (user != null) {
                          if (req.body.oldpass != null && req.body.newpass != null )
                          {
                            verif.checkvalue(req.body.newpass, 'PASSWORD', function(res) {
                              if (res == true && req.body.newpass.length > 5) {
                                var npass = req.body.newpass;
                                var opass = req.body.oldpass;

                                chgpass.cpass(user.auth.token,opass,npass,function(found){
                                  if (found.res == false)
                                  {
                                    req.flash.type = 'error'
                                    req.flash('FaillureProfile', found.response)
                                    callback(false);
                                  }
                                  else {
                                    req.flash.type = 'success'
                                    req.flash('FaillureProfile', 'Changement mot de passe effectué');
                                    callback(true);
                                  }
                                });
                              }
                              else {
                                req.flash.type = 'error'
                                req.flash('FaillureProfile', 'Mot de passe incorrect');
                                callback(false);
                              }
                            });
                          }
                        }
                        else {
                          req.flash.type = 'error'
                          req.flash('FaillureProfile', 'Erreur utilisateur inconnu')
                          callback(false);
                        }
                      });
                    };

                    exports.editpassword = function(req, callback) {
                      User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
                        if (user != null) {
                          if (req.body.newpass != "" || req.body.newpass != undefined) {
                          if (req.body.oldpass != null && req.body.newpass != null )
                          {
                            verif.checkvalue(req.body.newpass, 'PASSWORD', function(res) {
                              if (res == true && req.body.newpass.length > 5) {
                                var npass = req.body.newpass;
                                var opass = req.body.oldpass;

                                chgpass.cpass(user.auth.token,opass,npass,function(found){
                                  if (found.res == false)
                                  {
                                    callback(false);
                                  }
                                  else {
                                    callback(true);
                                  }
                                });
                              }
                              else {
                                callback(false);
                              }
                            });
                          }
                          else {
                            callback(false);
                          }
                        }
                        else {
                          callback(false);
                        }
                        }
                        else {
                          callback(false);}
                        });
                      };
