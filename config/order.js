var User = require('../config/models/user');
var Course = require('../config/models/course');
var Address = require('../config/models/address');
var maps    = require('../config/maps');
var verif = require('../config/verifinput')
var TMClient = require('textmagic-rest-client');
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyC9OlnDVBjsKhJXrbvRBup_BJ6208mYrRc', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

var pricesignature = 4.5;
var pricecode = 6.5;

var c = new TMClient('AlexandreCosta', 'LXQ4BLeesYv3Tadz9NwXb7zB3cQSRa');

var randomstring = require('../config/geneString');

verifrecipient = function(req) {
  verif.checkvalue(req.body.recipient_firstname, 'ALPHANAME', function(res){
    if (res == true)
      {
        verif.checkvalue(req.body.recipient_lastname, 'ALPHANAME', function(res) {
          if (res == true)
          {
            callback(true);
          }
          else {
              req.flash.type = 'error'
          		callback(false, req.flash('Failureorder', "Prénom du destinataire incorrect"), {'status': 608});
          	}
        })
      }
      else{
          req.flash.type = 'error'
      		callback(false, req.flash('Failureorder', "Nom du destinataire incorrect"), {'status': 608});
      	}
  })
}

verifsender = function(req) {
  verif.checkvalue(req.body.sender_firstname, 'ALPHANAME', function(res){
    if (res == true)
      {
        verif.checkvalue(req.body.sender_lastname, 'ALPHANAME', function(res) {
          if (res == true)
          {
            callback(true);
          }
          else{
              req.flash.type = 'error'
          		callback(false, req.flash('Failureorder', "Prénom de l\'expéditeur incorrect"), {'status': 608});
          	}
        })
      }
      else{
          req.flash.type = 'error'
      		callback(false, req.flash('Failureorder', "Nom de l\'expéditeur incorrect"), {'status': 608});
      	}
  })
}

exports.edit_order = function(req ,callback){
  var date = new Date();
  if (date.getHours() >= 9 && date.getHours() <= 19 && date.getDay() !== 0) {
    User.findOne({'_id' : req.session.user_id},function(err,user) {
      if (user != null) {
        if (req.body.sender_address == '' || req.body.recipient_address == '')
        {
          req.flash.type = 'error';
          req.flash('Failureorder', 'Adresse d\'envoi et/ou de réception incorrecte(s)');
          callback(false);
        }
        else {
          addressfinder(req.body.sender_address, user._id, function(err, addressstart) {
            if (err)
            {
              req.flash.type = 'error';
              req.flash('Failureorder', 'Erreur adresse d\'envoi');
              callback(false)
            }
            else {
              addressfinder(req.body.recipient_address, user._id, function(err, addressend) {
                if (err)
                {
                  req.flash.type = 'error'
                  req.flash('Failureorder', 'Erreur adresse de réception')
                  callback(false)
                }
                else {
                  maps.distances(addressstart.name, addressend.name, function(err, result, areaName){
                    if (err == false) {
                      req.flash.type = 'error'
                      req.flash('Failureorder', result.response)
                      callback(false);
                    }
                      else {
                        var  newcourse = new Course();
                        var distanceValue = Number.parseFloat(result.distance.value / 1000).toFixed(1);
                        //console.log("Distance Value", distanceValue, result.distance.value, result.duration);
                        newcourse.recipient.firstname = req.body.recipient_firstname;
                        if (distanceValue <= 2.0)
                        {
                            newcourse.details.price = 7;
                            newcourse.details.pricecourier = 3;
                        }
                        else if (distanceValue >= 2.1 && distanceValue <= 4.0)
                        {
                            newcourse.details.price = 11;
                            newcourse.details.pricecourier = 3;
                        }
                        else if (distanceValue >= 4.1 && distanceValue <= 7.0)
                        {
                            newcourse.details.price = 15;
                            newcourse.details.pricecourier = 3;
                        }
                        else {
                            newcourse.details.price = 26 + Math.round(distanceValue - 7) * 2.5;
                            newcourse.details.pricecourier = 3 + distanceValue * 1;
                        }
                        newcourse.recipient.lastname = req.body.recipient_lastname;
                        newcourse.recipient.phone = req.body.recipient_phone;
                        newcourse.recipient.instruction = req.body.description_recipient;
                        
                        newcourse.sender.firstname = req.body.sender_firstname;
                        newcourse.sender.lastname = req.body.sender_lastname;
                        newcourse.sender.phone = req.body.sender_phone;
                        newcourse.sender.instruction = req.body.description_sender;
                        
                        newcourse.address.idstartaddress = addressstart._id;
                        newcourse.address.idendaddress = addressend._id;
                        
                        newcourse.details.active = false;
                        newcourse.details.termined = false;
                        newcourse.details.payvalide = false;
                        newcourse.details.activecourier = false;
                        newcourse.details.estimatedtime = result.duration.text.split(" ")[0] + " min";
                        if (result.distance.value < 1000) {
                            newcourse.details.distance = result.distance.value + " m";
                        }
                        else {
                            newcourse.details.distance = distanceValue + " km";
                        }
                        newcourse.details.area = areaName;
                        
                        newcourse.link.iduser = req.session.user_id;
                        randomstring.geneString(6, 'alphanumeric', function(ref){
                          if (ref != false)
                          {
                            newcourse.link.refcourse = ref;
                            if (req.body.secure_code_option == 'on')
                            {
                              if (req.body.recipient_phone == '' || req.body.recipient_phone.length != 10 )
                              {
                                req.flash.type = 'error';
                                req.flash('Failureorder', 'Numéro de téléphone du destinataire incorrect');
                                callback(false);
                              }
                              newcourse.security.option = 1;
                              newcourse.details.price = newcourse.details.price + pricecode;
                              randomstring.geneString(6, 'numeric',  function(ref) {
                                if (ref != false)
                                {
                                  newcourse.security.code = ref;
                                  newcourse.save(function (err) {
                                    if (err) {
                                        callback(false);
                                    }
                                    else
                                      callback(newcourse);
                                  });
                                }
                                else {
                                  callback(false);
                                }
                              })
                            }
                            else if (req.body.signature_option == 'on')
                            {
                              newcourse.security.option = 2;
                              newcourse.details.price = newcourse.details.price + pricesignature;
                              newcourse.save(function (err) {
                                if (err){
                                    callback(false);
                                }
                                else
                                  callback(newcourse);
                              });
                            }
                            else {
                              newcourse.security.option = 0;
                              newcourse.save(function (err) {
                                if (err) {
                                  callback(false)
                                }
                              else {
                                callback(newcourse);
                              }
                            })
                          }
                        }
                      })
                    }
                  });
                }
              })
            }
          })
        }
      }
      else {
        req.flash.type = 'error'
        req.flash('Failureorder', 'Envoi impossible une erreur est survenue');
        callback(false);
      }
    });
  }
  else {
    req.flash.type = 'error'
    req.flash('Failureorder', 'Les commandes peuvent être réalise qu\'entre 9h et 19h du Lundi au Samedi.');
    callback(false)
  }
};

exports.final_order = function(req, user, callback) {
  Course.findOne({'link.iduser' : req.session.user_id,
  'link.refcourse' : req.body.refcourse},
  function(err, course) {
    if (err)
    callback(err);
    if (course)
    {
      if (course.security.option == 1)
      {
        c.Messages.send({text:"Bonjour, "+ course.sender.firstname + ' '+ course.sender.lastname +' vient de vous envoyer un colis via Tasso. Le code à donner au livreur à son arrivée est ' + course.security.code +'. Retrouvez-nous sur: www.tassodelivery.com . Cordialement, l\'équipe Tasso', phones: '+33'+course.recipient.phone}, function(err, res){
          if(res) {
            course.details.active = true;
            course.details.activecourier = true;
            SponsorBallance(user, function(res){
              course.save(function(err) {if (err) callback(null, false)});
              callback(null, true, course);
            });
          }
          else {
            callback(null, false);
          }
        });
      }
      else {
        course.details.active = true;
        course.details.activecourier = true;
        SponsorBallance(user, function(res){
          course.save(function(err) {if (err) callback(null, false)});
          callback(null, true, course);
        });
      }
    }
    else {
      callback(null, false);
    }
  });
};

exports.final_order_mobile = function(refcourse, user, callback) {
  Course.findOne({'link.iduser' : user._id, 'link.refcourse' : refcourse},
  function(err, course) {
    if (err)
    callback(err);
    if (course)
    {
      if (course.security.option == 1)
      {
        c.Messages.send({text:"Bonjour, "+ course.sender.firstname + ' '+ course.sender.lastname +' vient de vous envoyer un colis via Tasso. Le code à donner au livreur à son arrivée est ' + course.security.code +'. Retrouvez-nous sur: www.tassodelivery.com . Cordialement, l\'équipe Tasso', phones: '+33'+course.recipient.phone}, function(err, res){
          if(res) {
            course.details.active = true;
            course.details.activecourier = true;
            SponsorBallance(user, function(res){
              course.save(function(err) {if (err) callback(null, false)});
              callback(null, true, course);
            });
          }
          else {
            callback(null, false);
          }
        });
      }
      else {
        course.details.active = true;
        course.details.activecourier = true;
        SponsorBallance(user, function(res){
          course.save(function(err) {
            if (err) callback(null, false)
          });
          callback(null, true, course);
        });
      }
    }
    else {
      callback(null, false);
    }
  });
};

exports.resendcodeorder = function(req, callback) {
    User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
      Course.findOne({'link.iduser' : user._id,
      'link.refcourse' : req.body.refcourse, 'details.termined': false},
      function(err, course) {
        if (err)
        callback(false);
        if (course)
        {
        if (course.security.option == 1)
          {
            c.Messages.send({text:"Bonjour, "+ course.sender.firstname + ' '+ course.sender.lastname +' vient de vous envoyer un colis via Tasso. Le code à donner au livreur à son arrivée est ' + course.security.code +'. Retrouvez-nous sur: www.tassodelivery.com . Cordialement, l\'équipe Tasso', phones: '+33'+course.recipient.phone}, function(err, res){
              if(res) {
                  callback(true);
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
      });
    });
  }

function SponsorBallance(useractif, callback)
{
  User.findOne({'sponsor.code' : useractif.details.codesponsor}, function(err, user)
  {
    if (user)
    {
    if (useractif.details.countcourse > 1)
    {
      callback(false)
    }
    else {
      if (useractif.details.codesponsor == undefined)
        callback(false)
        else {
      if (user.sponsor.countUseractif < 3){
      user.wallet.balance = user.wallet.balance + 0; //ajout de fond au parain / fieulle
      user.sponsor.countUseractif = user.sponsor.countUseractif + 1
    }
    user.save(function(err) {
      if (err) {callback(false)}
      callback(true)
    })
  }
    }
  }
  else {
    callback(false)
  }
  });
}

function findLocality (ac, callback)
{
  for (var i = 0; i < ac.length; i++) {
    if (ac[i].types[0] == "locality") {
      callback(true, ac[i].long_name);
      }
    }
}

function addressfinder(name, iduser, callback){
  Address.find({'name': name, 'iduser': iduser}, function(err, addresslist) {
    if (addresslist.length == 0) {
      var  newaddress = new Address();
      newaddress.name = name;
      newaddress.iduser = iduser;
      geocoder.geocode(newaddress.name, function(err, coordinates){
        if(err) {callback(true)}
          if (coordinates != undefined && coordinates[0] != undefined) {
                  newaddress.city = coordinates[0].city;
                  newaddress.details.lng = coordinates[0].longitude;
                  newaddress.details.lat = coordinates[0].latitude;
                  newaddress.save(function(err){ if (err) callback(true);
                    callback(false, newaddress)
                  });
          }
      });
    }
    else {
      callback(false, addresslist[0]);
    }
  })
}
