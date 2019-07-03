var order = require('../config/order');
var stripe = require("stripe")("sk_live_TBV1axTP5BUk3fF8ThW02mu8"/*"sk_test_BQokikJOvBiI2HlWgH4olfQ2"*/);
var invoice = require('../config/invoicer');
const https = require('https');
const slackbot  = require('../config/slackBot');

///////MODELS/////////////
var User = require('../config/models/user');
var Address = require('../config/models/address')
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');
var Company = require('../config/models/company');

function httpRequest (data) {
    console.log("Notif send");
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
    };

    var body = {
        "public_key": "",
        "Steps" : [{
            "address" : "",
            "firstname" : "",
            "lastname" : "",
            "phone" : "",
            "option" : "",
            "instruction" : ""
        }, {
            "address" : "",
            "firstname" : "",
            "lastname" : "",
            "phone" : "",
            "option" : "",
            "instruction" : ""
        }],
    };

    //var https = require('https');
    var req = https.request(body, function(res) {
        res.on('data', function(data) {
            //console.log("Response:");
            //console.log(JSON.parse(data));
        });
    });

    req.on('error', function(e) {
        //console.log("ERROR:");
        //console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};

module.exports = function(app) {
    app.get('/gps/:refcourse', checkLogin, function(req, res) {
    User.findOne({'_id' : req.session.user_id},function(err,user) {
      Course.findOne({'link.iduser' : req.session.user_id,'link.refcourse' : req.params.refcourse}, function(err, course) {
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
                      res.json({start: gpslast[0].cordo,	end : address_recipent.details, courier : true, step: course.details.step});
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

//redirection ver track course
app.get('/charge/course/:refcourse', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    req.body.refcourse = req.params.refcourse;

    Course.findOne({'link.iduser' : req.session.user_id,'link.refcourse' : req.body.refcourse,'details.termined' : false, 'details.active': false},
    function(err, course) {
      if (course.details.payvalide == false)
      res.redirect('/accueil');
      else {
        order.final_order(req, user, function(err, result, course) {
          if (err)
          res.redirect('/accueil');
          if (course)
          {
 	        slackbot.saymsgCourse(user.auth.email + " has created a course #" + req.body.refcourse, course._id);
            res.redirect('/trackorder/'+ req.body.refcourse);
          }
          else {
            res.redirect('/accueil');
          }
        });
      }
    });
  });
});

//Payment de la course
app.post('/charge/course/:refcourse', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    Course.findOne({'link.iduser' : req.session.user_id,'link.refcourse' : req.params.refcourse,'details.termined' : false, 'details.active': false},
    function(err, course) {
      if (course) {
        user.wallet.balance = Math.round(user.wallet.balance*100)/100;
        if (user.wallet.balance < (course.details.price*1.2))
        {
          caseStripe(req, res, user, course);
        }
        else {
          casenoStripe(req, res, user, course);
        }
      }
    });
  });
});
}

function casenoStripe(req, res, user, course) {
  user.wallet.balance = user.wallet.balance - course.details.price*1.2;
  user.wallet.balance = Math.round(user.wallet.balance*100)/100;
  Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
    if (address_sender != null)
    {
      Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
        if (address_recipent != null)
        {
          if (err)
          res.render('commande/order_recapitulation.ejs', {
            sender : course.sender,
            recipientaddress: address_recipent.name,
            senderaddress : address_sender.name,
            recipient : course.recipient,
            details : course.details,
            option : course.security.option,
            refcourse : course.link.refcourse,
            balance: user.wallet.balance,});
            course.details.validatetime = new Date();
            course.time = new Date();
            if (user.details.idcompany) {
              Company.findOne({"_id": user.details.idcompany}, function(err, company) {
                company.wallet.balance = user.wallet.balance;
                if (company.validatestate == true) {
                invoice.GenReceip(req, res, company, course, 'reçu', 'course simple', function(result) {
                  if (result == true)
                  {
                    course.details.payvalide = true;
                    course.details.step = 1;
                    course.save(function(err) { if (err) res.redirect('/accueil');
                    user.save(function(err) {
                      res.redirect('/charge/course/'+req.params.refcourse)
                    });
                  });
                }
                else {
                  res.redirect('/accueil');
                }
              });
            }
            else {
              invoice.GenReceip(req, res, user, course, 'recu', 'course simple', function(result) {
                if (result == true)
                {
                  course.details.payvalide = true;
                  course.details.step = 1;
                  course.save(function(err) { if (err) res.redirect('/accueil');
                  user.save(function(err) {
                    res.redirect('/charge/course/'+req.params.refcourse)
                  });
                });
              }
              else {
                res.redirect('/accueil');
              }
            });
            }
            });
          }
          else {
            invoice.GenReceip(req, res, user, course, 'recu', 'course simple', function(result) {
              if (result == true)
              {
                course.details.payvalide = true;
                course.details.step = 1;
                course.save(function(err) { if (err) res.redirect('/accueil');
                user.save(function(err) {
                  res.redirect('/charge/course/'+req.params.refcourse)
                });
              });
            }
            else {
              res.redirect('/accueil');
            }
          });
        }
      }
    })
  }
})
}

function caseStripe(req, res, user, course) {
  paymentStripe(req, user, course, function(result) {
    if (result == false)
    {
      Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
        if (address_sender != null)
        {
          Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
            if (address_recipent != null)
            {
              console.log((course.details.price*1.2-user.wallet.balance)*100);
              res.render('commande/stripe_order_recapitulation.ejs', {
                sender : course.sender,
                email : user.details.email,
                recipientaddress: address_recipent.name,
                senderaddress : address_sender.name,
                recipient : course.recipient,
                details : course.details,
                option : course.security.option,
                refcourse : course.link.refcourse,
                stripe_price : (course.details.price*1.2-user.wallet.balance)*100,
                balance: user.wallet.balance,});
              }
            })
          }
        })
      }
      else {
        course.details.validatetime = new Date();
        course.time = new Date();
        if (user.details.idcompany) {
          Company.findOne({"_id": user.details.idcompany}, function(err, company) {
            company.wallet.balance = user.wallet.balance;
            //console.log("je suis ici facture");
            if (company.validatestate == true) {
            invoice.GenInvoiceCourseStripe(req, res, company, course, 'facture', 'course simple', function(result) {
              if (result == true)
              {
                user.wallet.balance = 0;
                course.details.payvalide = true;
                course.details.step = 1;
                course.save(function(err) { if (err) res.redirect('/accueil');
                user.save(function(err) { if (err) res.redirect('/accueil');
                res.redirect('/charge/course/'+req.params.refcourse)
              });
            });
          }
        });
      }
      else {
        invoice.GenInvoiceCourseStripe(req, res, user, course, 'facture', 'course simple', function(result) {
          if (result == true)
          {
            user.wallet.balance = 0;
            course.details.payvalide = true;
            course.details.step = 1;
            course.save(function(err) { if (err) res.redirect('/accueil');
            user.save(function(err) { if (err) res.redirect('/accueil');
            res.redirect('/charge/course/'+req.params.refcourse)
          });
        });
      }
    });
      }
      })
    }
    else {
      invoice.GenInvoiceCourseStripe(req, res, user, course, 'facture', 'course simple', function(result) {
        if (result == true)
        {
          user.wallet.balance = 0;
          course.details.payvalide = true;
          course.details.step = 1;
          course.save(function(err) { if (err) res.redirect('/accueil');
          user.save(function(err) { if (err) res.redirect('/accueil');
          res.redirect('/charge/course/'+req.params.refcourse)
        });
      });
    }
  });
    }
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

function checkLogin(req, res, next) {
	if(req.session.user_id)
	return next();
	res.redirect('/');
}
