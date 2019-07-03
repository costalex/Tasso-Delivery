var Managepackage = require('../config/managePackage');
var randomstring = require('../config/geneString');
var stripe = require("stripe")("sk_live_TBV1axTP5BUk3fF8ThW02mu8"/*"sk_test_BQokikJOvBiI2HlWgH4olfQ2"*/);
var invoice = require('../config/invoicer');

///////MODELS/////////////
var User = require('../config/models/user');
var Packagelist = require('../config/models/packagelist');
var Package = require('../config/models/package');

module.exports = function(app) {

app.get('/wallet', checkLogin,function(req, res){
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    Managepackage.initPackage(function() {
      Packagelist.findOne({"details.name": "Pack pro"}, function(err, package1) {
        Packagelist.findOne({"details.name": "Pack entreprise"}, function(err, package2) {
          res.render('menu/wallet.ejs', {balance: user.wallet.balance, email: user.details.email, wallet : user.wallet, package1 : package1.details, package2 : package2.details});
        });
      });
    });
  });
});

app.post('/charge/wallet/:packagename', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
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
      //  res.redirect('/wallet');
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
              res.redirect('/wallet')
            });
          });
        }
        else {
          res.redirect('/wallet')
        }
      });
    }
  });
});
});
});
}

function checkLogin(req, res, next) {
	if(req.session.user_id)
	return next();
	res.redirect('/');
}
