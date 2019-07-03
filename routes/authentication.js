var chgpass = require('../config/chgpass');
var register = require('../config/register');
var login = require('../config/login');
var slackbot  = require('../config/slackBot');
var simple_recaptcha = require('simple-recaptcha-new');
///////MODELS/////////////

module.exports = function(app) {

app.get('/login', function(req, res) {
  res.render('authentication/login.ejs', {message: req.flash('FailureLogin'), type: req.flash.type}); });

app.post('/login',function(req,res){
              if (req.body.email != null && req.body.password != null)
              {
                  login.login(req, function (user) {
                      if (user != null && user.details.typeuser == 0) {
                          req.session.user_id = user._id;
                          user.details.connection = new Date();
                          user.save(function (err) { if (err) res.redirect('/login');
                          else
                            res.redirect('/accueil');
                        });
                      }
                      else if (user != null && user.details.typeuser == 3) {
                          req.session.user_id = user._id;
                          user.details.connection = new Date();
                          user.save(function (err) { if (err) res.redirect('/login');
                          res.redirect('/admin/accueil');
                        })
                      }
                      else
                        res.redirect('/login');
                  })
              }
              else {
                  res.redirect('/login');
              }
          });

  app.get('/registration', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('authentication/registration.ejs', {message: req.flash('FailureRegister'), type: req.flash.type});
  });

  app.post('/registration',function(req,res){
    if (req.body.email != null && req.body.password != null)
    {
      var email = req.body.email;
      var password = req.body.password;
      if (req.body.cgu_checkbox == 'on') {
        simple_recaptcha('6LekOzAUAAAAAFlxOHiAeOuKz9_CWXT1HlGuOrnK', req.body['g-recaptcha-response'], (error) => {
          if (error) {
            //console.log(error, req.body);
            res.redirect('/logout')
          }
          else {
            register.register(req, email, password, 0, function (creat, status, user) {
              if (creat == true) {
                slackbot.saymsgAccount(email + " has created an account");
                res.redirect('/login');
              }
              else {
                res.status = status;
                res.redirect('/registration'); //ajout du message pour savoir l'erreur
              }
            });
          }
        })
      }
      else {
        req.flash.type = 'error'
        req.flash("FailureRegister", "Veuillez accepter les CGU")
        res.redirect('/registration');
      }
    }
    else {
      res.redirect('/login');
    }
  });

  app.get('/forgot_password',function(req, res) {
    res.render('authentication/forgot_password.ejs', {message: req.flash('FailurePass'), type: req.flash.type});
  });

  app.post('/forgot_password', function(req, res) {

    var email = req.body.email;

    chgpass.respass_init(email,function(found){
      if (found.res == false)
      {
        req.flash.type = 'error';
        req.flash('FailurePass', found.response);
        res.redirect('/forgot_password');
      }
      else {
        //console.log(found.response);
        req.flash.type = 'success';
        req.flash('FailureLogin', found.response);
        res.redirect('/login');
      }
    });
  });

  app.get('/logout', function (req, res) {
    delete req.session.user_id;
    res.redirect('/login');
  });

}

function checkLogin(req, res, next) {
  if(req.session.user_id)
  return next();
  res.redirect('/');
}
