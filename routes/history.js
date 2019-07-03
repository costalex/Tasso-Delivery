var Managecourse = require('../config/coursemanager');

var User = require('../config/models/user');
var Course = require('../config/models/course');

module.exports = function(app) {
//création et envoi de l'historique
app.get('/history', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    getcoursetableactive(true,req.session.user_id, false,function(err, courseactive, lenghtactive) {
      if (err == true)
        res.redirect('/accueil');
      else {
        getcoursetablefinish(false,req.session.user_id, true, function(err, coursefinish, lengthfinish) {
          if (err == true)
            res.redirect('/accueil');
          else {
            res.render('compte/history.ejs', {balance: user.wallet.balance, commandefinish : JSON.stringify(coursefinish), commandeactif: JSON.stringify(courseactive), commandefinishlength : lengthfinish, commandeactiflength : lenghtactive});
          }
        })
      }
    })
  });
});

/*app.get('/notification', checkLogin, function(req, res) {
  User.findOne({'_id' : req.session.user_id},function(err,user) {
    getcoursetableactive(true,req.session.user_id, false, function(err, courseactive, lenghtactive, limit) {
      if (lenghtactive > 0 && err != true)
        res.json(courseactive, lenghtactive);
        else {
          res.json(0);
        }
    })
  })
})*/
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
    callback(false, 0, 0);
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
      callback(false, 0, 0);
    }
});
}

function checkLogin(req, res, next) {
	if(req.session.user_id)
	return next();
	res.redirect('/');
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
