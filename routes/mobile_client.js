var login = require('../config/login');
var chgpass = require('../config/chgpass');
var Gps = require('../config/models/gps');
var User = require('../config/models/user');
var Course = require('../config/models/course');
var order = require('../config/order');
var Managepackage = require('../config/managePackage');
var Packagelist = require('../config/models/packagelist');
var stripe = require("stripe")("sk_live_TBV1axTP5BUk3fF8ThW02mu8"/*"sk_test_iPcrHEKgJMJHZT7EQ42Hb2zd"*/);
var invoice = require('../config/invoicer');
var Address = require('../config/models/address');
var Managecourse = require('../config/coursemanager');
var register = require('../config/register');
var Package = require('../config/models/package');
var randomstring = require('../config/geneString');

module.exports = function(app) {

  app.get('/app/gps/:refcourse', checkLoginAppClient, function(req, res) {
    User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
      Course.findOne({'link.iduser' : user._id,'link.refcourse' : req.params.refcourse}, function(err, course) {
        if (course) {
          if (course.details.payvalide == true) {
            Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
              if (address_sender != null)
              {
                Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
                  if (address_recipent != null)
                  {
                    if (course.details.activecourier == true || course.details.termined == true)
                    {
                      res.json({start: address_sender.details,end : address_recipent.details, courier : false, step: course.details.step})
                    }
                    else if (course.details.activecourier == false) {
                      Gps.find({'idcourse' : course.link.refcourse}, null, {sort: {time: -1}}, function(err, gpslast) {
                        res.json({start: gpslast[0].cordo,        end : address_recipent.details, courier : true, step: course.details.step});
                      });
                    }
                    else {
                      res.json({start: address_sender.details,end : address_recipent.details, courier : false, step: course.details.step})
                    }
                  }
                });
              }
            });
          }
          else {
            res.redirect('/accueil');
          }
        }
        else {
          res.redirect('/accueil');
        }
      });
    });
  });

  app.get('/app/history_client', checkLoginAppClient, (req, res) => {
    User.findOne({'auth.temp_str' : req.headers.token}, (err,user) => {
      getcoursetableactive(true, user._id, false, (err, courseactive, lenghtactive) => {
        if (err == true)
        res.redirect('/app/Error');
        else {
          getcoursetablefinish(false,user._id, true, (err, coursefinish, lengthfinish) => {
            if (err == true)
            res.redirect('/app/Error');
            else {
              res.json({commandefinish : coursefinish, commandeactif: courseactive/*, commandefinishlength : lengthfinish, commandeactiflength : lenghtactive*/});
            }
          })
        }
      })
    });
  })

  app.post('/app/recap_course', checkLoginAppClient, (req, res) => {
    User.findOne({'auth.temp_str' : req.headers.token}, (err,user) => {
      if (user)
      {
        order.editorder_modile(req, (result) => {
          if (result == false)
          res.redirect('/app/Error');
          else {
            Address.findOne({'_id': result.address.idstartaddress}, (err, address_sender) => {
              if (address_sender != null)
              {
                Address.findOne({'_id' : result.address.idendaddress}, (err, address_recipent) => {
                  if (address_recipent != null)
                  {
                    user.wallet.balance = Math.round(user.wallet.balance*100)/100;
                    if (user.wallet.balance < (result.details.price*1.2))
                    {
                      res.json({
                        email : user.details.email,
                        sender : result.sender,
                        recipientaddress: address_recipent.name,
                        senderaddress : address_sender.name,
                        recipient : result.recipient,
                        details : result.details,
                        option : result.security.option,
                        refcourse : result.link.refcourse,
                        stripe_price : (result.details.price*1.2-user.wallet.balance)*100,
                        balance: user.wallet.balance});
                      }
                      else {
                        res.json({
                          email : user.details.email,
                          sender : result.sender,
                          recipientaddress: address_recipent.name,
                          senderaddress : address_sender.name,
                          recipient : result.recipient,
                          details : result.details,
                          option : result.security.option,
                          refcourse : result.link.refcourse,
                          stripe_price : result.details.price*1.2*100,
                          balance: user.wallet.balance});
                        }
                      }
                    })
                  }
                  else
                  res.redirect('/app/Error');
                })
              }
            });
          }
          else
          res.redirect('/app/Error');
        });
      });

      //Payment de la course
      app.post('/app/charge/course/:refcourse', checkLoginAppClient, function(req, res) {
        User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
          Course.findOne({'link.iduser' : user._id,'link.refcourse' : req.params.refcourse,'details.termined' : false, 'details.active': false},
          function(err, course) {
            if (course) {
              user.wallet.balance = Math.round(user.wallet.balance*100)/100;
              if (user.wallet.balance < (course.details.price*1.2)) {
                caseStripe(req, res, user, course);

              }
              else {
                casenoStripe(req, res, user, course);
              }
            }
            else if (err)
              res.redirect('/app/Error');
          });
        });
      });

      app.post('/app/charge/wallet/:packagename', checkLoginAppClient, function(req, res) {
        User.findOne({'auth.temp_str' : req.headers.token}, (err,user) => {
          Packagelist.findOne({'details.name' : req.params.packagename},
          function(err, packageadd) {
            var token = req.body.stripeToken;
            var chargeAmount = packageadd.details.stripe_price;
            var charge = stripe.charges.create({
              amount: chargeAmount,
              currency: "eur",
              source: token
            }, function(err, charge) {
              if (err)
              {
                res.json({'response':"Invalid request"})
              }
            });
            user.wallet.balance = user.wallet.balance + packageadd.details.value;
            var newpackage = new Package();
            randomstring.geneStringPackage(7, 'alphanumeric', function(ref){
              if (ref != false)
              {
                newpackage.refpackage = ref;
                newpackage.iduser = user._id;
                newpackage.time =   new Date();
                newpackage.details = packageadd.details
                invoice.GenInvoiceForfait(req, res, user, newpackage, 'facture',req.params.packagename, function(result) {
                  if (result == true)
                  {
                    newpackage.save(function(err) {if (err) res.json({'response':"Invalid save package"});
                    user.save(function(err) {if (err) res.json({'response':"Invalid save user"});
                    res.json({balance: user.wallet.balance})
                  });
                });
              }
              else {
                res.json({'response':"Invalid request"})
              }
            });
          }
        });
      });
      });
      });

      app.get('/app/wallet', checkLoginAppClient,function(req, res){
        User.findOne({'auth.temp_str' : req.headers.token}, (err,user) => {
          res.json({balance: user.wallet.balance});
        });
      });

      app.get('/app/packages', checkLoginAppClient, (req, res) => {
        User.findOne({'auth.temp_str' : req.headers.token}, (err,user) => {
          Managepackage.initPackage( function() {
            Packagelist.findOne({"details.name": "Pack pro"}, (err, package1) => {
              Packagelist.findOne({"details.name": "Pack entreprise"}, (err, package2) => {
                let resArray = []
                resArray[0] = package1.details;
                resArray[1] = package2.details;
                res.json(resArray);
              });
            });
          });
        });
      });

      app.get('/app/sponsor', checkLoginAppClient, (req, res) => {
        User.findOne({'auth.temp_str' : req.headers.token}, (err, user) => {
          if (err)
          res.redirect('/app/Error');
          else
          res.json({code : user.sponsor.code});
        })
      })

      app.post('/app/registration', (req,res) => {
        if (req.body.email != null && req.body.password != null)
        {
          var email = req.body.email;
          var password = req.body.password;
          if (req.body.cgu_checkbox == 'on') {
            register.register(req, email, password, 0, function (creat, status, user) {
              if (creat == true)
              res.json({'response': "ok"});
              else {
                res.redirect('/app/Error');
              }
            });
          }
          else {
            res.redirect('/app/Error');
          }
        }
        else {
          res.redirect('/app/Error');
        }
      });

      app.get('/app/trackorder/:refcourse', checkLoginAppClient, (req, res) => {
        User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
          Course.findOne({'link.iduser' : user._id,'link.refcourse' : req.params.refcourse}, function(err, course) {
            if (course) {
              if (course.details.payvalide == true) {
                Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
                  if (address_sender != null)
                  {
                    Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
                      if (address_recipent != null)
                      {
                        if (course.details.termined == true || course.details.active == true)
                        {
                          res.json({
                            takecourse : false,
                            start: address_sender.details,
                            end : address_recipent.details,
                            sender : course.sender,
                            recipientaddress: address_recipent.name,
                            senderaddress : address_sender.name,
                            recipient : course.recipient,
                            details : course.details,
                            option : course.security.option,
                            refcourse : course.link.refcourse,
                            stripe_price : course.details.price*1.2*100,
                            balance: user.wallet.balance,
                            step: course.details.step,
                            courier: false});
                          }
                          else {
                            Gps.find({'idcourier' : user._id, 'idcourse' : course.link.refcourse, '_id' : course.link.idgps}, null, {sort: {time: -1}}, function(err, gpslast) {
                              if (gpslast[0] != undefined)
                              {
                                res.json({
                                  takecourse : true,
                                  start: gpslast[0].cordo,
                                  end : address_recipent.details,
                                  sender : course.sender,
                                  recipientaddress: address_recipent.name,
                                  senderaddress : address_sender.name,
                                  recipient : course.recipient,
                                  details : course.details,
                                  option : course.security.option,
                                  refcourse : course.link.refcourse,
                                  stripe_price : course.details.price*1.2*100,
                                  balance: user.wallet.balance,
                                  step: course.details.step,
                                  courier: false});
                                }
                                else {
                                  res.json({
                                    takecourse : false,
                                    start: address_sender.details,
                                    end : address_recipent.details,
                                    sender : course.sender,
                                    recipientaddress: address_recipent.name,
                                    senderaddress : address_sender.name,
                                    recipient : course.recipient,
                                    details : course.details,
                                    option : course.security.option,
                                    refcourse : course.link.refcourse,
                                    stripe_price : course.details.price*1.2*100,
                                    balance: user.wallet.balance,
                                    step: course.details.step,
                                    courier: false});
                                  }
                                })
                              }
                            }
                          });
                        }
                      });
                    }
                    else {
                      res.redirect('/app/Error');
                    }
                  }
                  else {
                    res.redirect('/app/Error');
                  }
                });
              });
            })
          }

          function casenoStripe(req, res, user, course) {
            user.wallet.balance = user.wallet.balance - course.details.price*1.2;
            user.wallet.balance = Math.round(user.wallet.balance*100)/100;
            if(user.wallet.balance < 1)
            user.wallet.balance = 0
            Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
              if (address_sender != null)
              {
                Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
                  if (address_recipent != null)
                  {
                    if (err) {
                      res.redirect('/app/Error');
                    }
                    course.details.validatetime = new Date();
                    course.time = new Date();
                    invoice.GenReceip(req, res, user, course, 'recu', 'course simple', function(result) {
                      if (result == true)
                      {
                        course.details.payvalide = true;
                        course.details.step = 1;
                        course.save(function(err) {
                          if (err)
                            res.redirect('/app/Error');
                          user.save(function(err) {
                            if (err)
                            res.redirect('/app/Error');
                            order.final_order_mobile(req.params.refcourse, user, function(err, result, course) {
                              if (course)
                                res.json({refcourse : req.params.refcourse})
                              else
                                res.redirect('/app/Error');
                            })
                          });
                        });
                      }
                      else {
                        res.redirect('/app/Error');
                      }
                    });
                  }
                })
              }
            })
          }

          function caseStripe(req, res, user, course) {
            paymentStripe(req, user, course, function(result) {
              if (result == false)
                res.redirect('/app/Error');
              else {
                course.details.validatetime = new Date();
                course.time = new Date();
                invoice.GenInvoiceCourseStripe(req, res, user, course, 'facture', 'course simple', function(result) {
                  if (result == true)
                  {
                    user.wallet.balance = 0;
                    course.details.payvalide = true;
                    course.details.step = 1;
                    course.save(function(err) {
                      if (err)
                      res.redirect('/app/Error');
                      user.save(function(err) {
                        if (err)
                        res.redirect('/app/Error');
                        order.final_order_mobile(req.params.refcourse, user, function(err, result, course) {
                          if (course)
                            res.json({refcourse : req.params.refcourse})
                          else
                            res.redirect('/app/Error');
                        })
                      });
                    });
                  }
                });
              }
            });
          }

          function paymentStripe(req, user, course, callback) {
            var token = req.body.stripeToken;
            var chargeAmount = Math.round((course.details.price*1.2 - user.wallet.balance)*100);
            var charge = stripe.charges.create({
              amount: chargeAmount,
              currency: "eur",
              source: token
            }, function(err, charge) {
              if (err)
              {
                callback(false);
              }
              else {
                callback(true);
              }
            });
          }

          function getcoursetablefinish(activecourier, iduser, termined, callback) {
            Course.find({'details.activecourier' : activecourier, "link.iduser" : iduser,'details.termined' : termined}, function(err, listcourses) {
              if (err)
              callback(true, err);
              if (listcourses.length != 0)
              {
                var arraycoursesfinish = [];
                nbexecutionsTermine=0;
                for(var i = 0; i < listcourses.length; i++)
                {
                  if (listcourses[i].details.validatetime != undefined)
                  Managecourse.Coursenoterminedsend(listcourses[i], function(courses) {
                    nbexecutionsTermine++;
                    arraycoursesfinish.push(courses);
                    if (nbexecutionsTermine == listcourses.length)
                    {
                      arraycoursesfinish = sortByKey(arraycoursesfinish, 'validatetime');
                      callback(false, arraycoursesfinish, arraycoursesfinish.length);
                    }
                  });
                  else
                  nbexecutionsTermine++;
                }
              }
              else {
                callback(false, null, 0);
              }
            });
          }

          function getcoursetableactive(payvalide, iduser, termined, callback) {
            Course.find({'details.payvalide' : payvalide, "link.iduser" : iduser, 'details.termined' : termined}, function(err, listcourses) {
              if (err)
              callback(true, err);
              if (listcourses.length != 0)
              {
                var arraycourses = [];
                var nbexecutionsTermine=0;
                for(var i = 0; i < listcourses.length; i++)
                {
                  if (listcourses[i].details.validatetime != undefined)
                  Managecourse.Coursenoterminedsend(listcourses[i], function(courses) {
                    nbexecutionsTermine++;
                    arraycourses.push(courses);
                    if (nbexecutionsTermine == listcourses.length) {
                      arraycourses = sortByKey(arraycourses, 'validatetime');
                      callback(false, arraycourses, arraycourses.length);
                    }
                  });
                  else
                  nbexecutionsTermine++;
                }
              }
              else {
                callback(false, null, 0);
              }
            });
          }

          function checkLoginAppClient(req, res, next) {
            if (req.headers.token != undefined && req.headers.token != '')
            {
              User.findOne({'auth.temp_str' : req.headers.token, 'details.typeuser': 0},function(err,user) {
                if (user)
                return next();
                else
                res.redirect('/app/Error');
              });
            }
            else
              res.redirect('/app/BadToken');
          }

          function sortByKey(array, key) {
            if (array != 0){
              return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
              });
            }
            else {
              return 0;
            }
          }
