var multer = require("multer");
var order = require('../config/order');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + file.originalname + '-' + Date.now() + '.png')
	}
})

var upload = multer({ storage: storage })
var User = require('../config/models/user');
var Address = require('../config/models/address')
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');


module.exports = function(app) {

app.get('/accueil', checkLogin, CleanCourse, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    if (user != null)
    {
      res.render('commande/order.ejs', {
        sender : user.details,
        recipient: 0,
        sender_address : user.details.address,
        recipient_address : "",
        type: req.flash.type,
        message: req.flash('Failureorder'),
        balance: user.wallet.balance,
      });
    }
  });
});

//SAVE INFO
app.post('/accueil', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    order.edit_order(req, function(result) {
      if (result == false) {
        res.redirect('/accueil');
      }
      else {
        Address.findOne({'_id': result.address.idstartaddress}, function(err, address_sender) {
          if (address_sender != null)
          {
            Address.findOne({'_id' : result.address.idendaddress}, function(err, address_recipent) {
              if (address_recipent != null)
              {
                user.wallet.balance = Math.round(user.wallet.balance*100)/100;
                if (user.wallet.balance < (result.details.price*1.2))
                {
                  res.render('commande/stripe_order_recapitulation.ejs', {
                    email : user.details.email,
                    sender : result.sender,
                    recipientaddress: address_recipent.name,
                    senderaddress : address_sender.name,
                    recipient : result.recipient,
                    details : result.details,
                    option : result.security.option,
                    refcourse : result.link.refcourse,
                    stripe_price : (result.details.price*1.2-user.wallet.balance)*100,
                    balance: user.wallet.balance,});
                  }
                  else {
                    res.render('commande/order_recapitulation.ejs', {
                      email : user.details.email,
                      sender : result.sender,
                      recipientaddress: address_recipent.name,
                      senderaddress : address_sender.name,
                      recipient : result.recipient,
                      details : result.details,
                      option : result.security.option,
                      refcourse : result.link.refcourse,
                      stripe_price : result.details.price*1.2*100,
                      balance: user.wallet.balance,});
                    }
                  }
                })
              }
            })
          }
        });
      });
    });

app.post('/course_validate/delete', checkLogin, function(req, res){
      Course.findOneAndRemove({'link.iduser' : req.session.user_id, 'link.refcourse' : req.params.refcourse,
      'details.termined' : false},function(err,user) {
        if (err)
          res.redirect('/accueil');
        if (user)
          res.redirect('/accueil');
        else {
          res.redirect('/accueil');
        }
      });
    });

app.post('/:refcourse', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    if (user != null)
    {
      reditecourse(req, function(err, sender, recipient, course) {
        if (err == true)
        res.redirect('/accueil');
        else
        {
          res.render('commande/order.ejs', {
            sender : course.sender,
            recipient: course.recipient,
            sender_address : sender,
            recipient_address : recipient,
            message: req.flash('Faillureorder'),
            balance: user.wallet.balance,
          });
        }
      })
    }
  });
});

}

function reditecourse(req, callback) {
  Course.findOne({'link.iduser' : req.session.user_id, 'link.refcourse' : req.params.refcourse,'details.termined' : false}, function(err, course) {
    if (err)
    callback(true);
    if (course)
      {
        Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
          if (address_sender != null)
          {
            Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
              if (address_recipent != null)
              {
                callback(false, address_sender.name, address_recipent.name, course);
              }
            });
          }
        })
      }
      else {
        callback(true)
      }
  });
}

function checkLogin(req, res, next) {
  	if(req.session.user_id)
  	return next();
  	res.redirect('/');
  }

function CleanCourse(req, res, next) {
  	Course.find({"link.iduser": req.session.user_id, "details.active": false, "details.termined": false}).remove().exec(function(err, data) {
  		next();
  	});
  }
