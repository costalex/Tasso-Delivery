
var order = require('../config/order');
var Managecourse = require('../config/coursemanager');

var User = require('../config/models/user');
var Address = require('../config/models/address')
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////     MENU        ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app) {

app.get('/notification', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
      getcoursenotif(false,req.session.user_id, true, 3,function(err, course, length) {
        if (err == true)
        {
          res.json({'courses': 0, "limit": 0});
        }
        else {
          res.json({'courses': course, "limit": length});
        }
      })
    })
  })

app.get('/trackorder/:refcourse', checkLogin, function(req, res) {
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
                if (course.details.termined == true || course.details.active == true)
                {
                  res.render('commande/track_order.ejs', {
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
                      res.render('commande/track_order.ejs', {
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
                    res.render('commande/track_order.ejs', {
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
            res.redirect('/accueil');
          }
        }
        else {
          res.redirect('/accueil');
        }
      });
    });
  });


  app.get('/parrainage', checkLogin, function(req, res) {
    User.findOne({'_id' : req.session.user_id},function(err,user) {
      if (user != null)
      {
        res.render('menu/sponsorship.ejs', {codesponsor : user.sponsor.code, balance: user.wallet.balance,});
      }
    });
  });
}

function getcoursenotif(activecourier, iduser, termined, limit,callback) {
  Course.find({'details.payvalide' : true, "link.iduser" : iduser, 'details.termined' : false}, function(err, listcourses) {
    //onsole.log(listcourses);
    if (err)
      callback(true, err);
    if (listcourses.length != 0)
    {
      var notifcourse = [];
      nbexecutionsTermine=0;
      for(var i = 0; i < listcourses.length; i++)
      {
        if (listcourses[i].details.validatetime != undefined)
        Managecourse.Managenotification(listcourses[i], function(courses) {
          nbexecutionsTermine++;
          notifcourse.push(courses);
          if (nbexecutionsTermine == listcourses.length)
          {
            notifcourse = sortByKey(notifcourse, 'validatetime');
            if (notifcourse.length < limit)
              limit = notifcourse.length;
            callback(false, notifcourse, limit);
          }
        });
        else
        nbexecutionsTermine++;
      }
    }
    else {
    callback(false, 0, 0);
    }
  });
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

function checkLogin(req, res, next) {
  	if(req.session.user_id)
  	return next();
  	res.redirect('/');
  }
