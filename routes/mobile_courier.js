var chgpass = require('../config/chgpass');
var login = require('../config/login');
var profile = require('../config/profile');
var order = require('../config/order');
var Managecourse = require('../config/coursemanager');
var randomstring = require('../config/geneString');
var moment = require('moment');
var multer = require("multer");

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + file.originalname + '-' + Date.now() + '.png')
	}
})

var upload = multer({ storage: storage })

///////MODELS/////////////
var User = require('../config/models/user');
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');

module.exports = function(app) {

app.get('/app/Error',function(req,res) {
	res.status(401);
	res.json({'response':"Invalid Information", "message" : req.flash("Error")[0]});
})

app.get('/app/BadToken',function(req,res) {
	res.status(499);
	res.json({'response':"Invalid Token"});
})

app.post('/app/sendcode', function(req, res) {
	order.resendcodeorder(req, function(result) {
		if (result == true)
		{
			res.status(200);
			res.json({'response': "ok"});
		}
		else {
			res.status(610);
			res.json({'response': "Invalid "});
		}
	})
})

app.post('/app/upload', checkLoginAppCourrier, upload.single('image'), function(req, res) {
	try {
		User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
			Course.findOne({'link.refcourse': user.courier.idcourse, 'link.idcourier' : user._id,  'details.termined': false}, function(err, course) {
				course.security.signature = req.file.filename;
				user.courier.idcourse = '';
				user.courier.countcourse = user.courier.countcourse + 1;
				course.details.termined = true;
				course.details.step = 4;
				course.details.endcoursetime = new Date();
				user.save(function(err) {	if (err) res.json({'response':"Invalid Information user"});
				course.save(function(err) {if (err) res.json({'response':"Invalid Information course"});
				res.status(200);
				res.json({'response': "ok"});
			})
		})
	})
})
} catch (err) {
	res.sendStatus(400);
}
})

app.post('/app/course/termined', checkLoginAppCourrier, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		Course.findOne({'link.refcourse': req.body.refcourse, 'link.idcourier': user._id, 'details.termined': false}, function(err, course)
		{
			if (err)
			res.redirect('/app/Error');
			else{
				if (course && user)
				{
					if (course.security.option == 1)
					{
						if (course.security.code == req.body.code)
						{
							user.courier.idcourse = '';
							user.courier.countcourse = user.courier.countcourse + 1;
							course.details.termined = true;
							course.details.step = 4;
							course.details.endcoursetime = new Date();
							course.save(function(err) {if (err) res.json({'response':"Invalid Information course"});
							else {
								res.status(200);
								res.json({'response': "ok"});
							}
						});
					}
						else {
							course.save(function(err) {if (err) res.json({'response':"Invalid Information course"});
							else {
								res.status(200);
								res.json({'response': "ok"});
							}
						});
					}
				}
				else if (course.security.option == 0)
				{
					user.courier.idcourse = '';
					user.courier.countcourse = user.courier.countcourse + 1;
					course.details.termined = true;
					course.details.step = 4;
					course.details.endcoursetime = new Date();
					user.save(function(err) {if (err) res.json({'response':"Invalid Information user"});
					course.save(function(err) {if (err) res.json({'response':"Invalid Information course"});
					res.status(200);
					res.json({'response': "ok"});
					});
				});
			}
		else {
			res.status(610);
			res.json({'response': "Invalid Code"});
		}
	}
	else {
		res.status(606);
		res.json({'response': "Invalid"});
	}
}
});
});
})

app.post('/app/takecourse',checkLoginAppCourrier, function(req,res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		Course.findOne({'link.refcourse': req.body.refcourse, 'details.activecourier': true}, function(err, course) {
			if (user && course) {
				course.link.idcourier = user._id;
				user.courier.idcourse = course.link.refcourse;
				course.details.activecourier = false;
				var newgps = new Gps();
				newgps.idcourse = course.link.refcourse;
				newgps.idcourier = user._id;

				newgps.cordo.lng = req.body.lng;
				newgps.cordo.lat = req.body.lat;
				newgps.time = new Date();
				course.link.idgps = newgps._id;
				course.details.step = 2;
				user.save(function(err) {if (err) res.json({'response':"Invalid Information"});
				course.save(function(err) {if (err) res.json({'response':"Invalid Information"});
				newgps.save(function(err) {if (err) res.json({'response':"Invalid Information"});
				res.status(200);
				res.json({'response':"ok"});
			});
		});
	});
}
else {
	res.redirect('/app/Error');
}
});
});
})

app.post('/app/startcourse', checkLoginAppCourrier, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		Course.findOne({'link.refcourse': req.body.refcourse, 'link.idcourier' : user._id, 'details.termined': false }, function(err, course) {
			if (err)
			res.redirect('/app/Error');
			if (user && course)
			{
				course.details.step = 3;
				course.details.startcoursetime = new Date();
				course.save(function(err) {if (err) {res.json({'response':"Invalid Information"})}
				res.end();
			});
		}
		else {
			res.redirect('/app/Error');
		}
	});
});
})

app.get('/app/coursereload', checkLoginAppCourrier, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		Course.findOne({'link.refcourse': user.courier.idcourse, 'link.idcourier' : user._id,  'details.termined': false}, function(err, course) {
			if (err)
			res.redirect('/app/Error');
			if (user && course)
			{
				Managecourse.detailssendreload(course, function(coursedetails) {
					res.json(coursedetails);
				})
			}
			else {
				res.json({course: false});
				res.end();
			}
		});
	});
})

//ok
app.get('/app/courses', checkLoginAppCourrier, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		if (err)
			res.redirect('/app/Error');
		else {
			Course.find({'details.activecourier' : true, 'details.area' : user.courier.area},function(err, listcourses) {
				if (err)
					res.redirect('/app/Error');
					if (listcourses.length != 0)
					{
						var limit = 10;
						var arraycourses = [];
						var nbexecutionsTermine=0;
						for(var i = 0; i < listcourses.length; i++)
							{
								Managecourse.detailssend(listcourses[i], function(courses) {
									nbexecutionsTermine++;
									arraycourses.push(courses);
									if (nbexecutionsTermine == limit || nbexecutionsTermine == listcourses.length){					//	arraycourses = sortByKey(arraycourses, 'distance') sort by distaance courier - coursest
										res.json(arraycourses);}
									})
							}
					}
				else
					res.json();
				});
			}
		});
	});

	//ok
	app.post('/app/gps', checkLoginAppCourrier, function(req, res) {
		User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
			if (err)
			{
				res.redirect('/app/Error');
			}
			Gps.findOne({'idcourier' : user._id, 'idcourse' : req.body.refcourse}, function(err, gps)
			{
				if (user && gps)
				{
					var newgps = new Gps();
					newgps.idcourse = req.body.refcourse;
					newgps.idcourier = gps.idcourier;
					newgps.cordo.lat = req.body.lat;
					newgps.cordo.lng = req.body.lng;
					newgps.cordo.lat = req.body.lat;

					var tmp_date = new Date();
					newgps.time = new Date(tmp_date.getFullYear(), tmp_date.getMonth(), tmp_date.getDate(), tmp_date.getHours(), tmp_date.getMinutes(), tmp_date.getSeconds());
					newgps.save(function(err) {if (err) res.json({'response':"Invalid Information"})
					res.status(200);
					res.json({'response':"ok"});
				});
			}
			else {
				var newgps = new Gps();
				newgps.idcourier = user._id;

				newgps.cordo.lng = req.body.lng;
				newgps.cordo.lat = req.body.lat;

				var tmp_date = new Date();
				newgps.time = new Date(tmp_date.getFullYear(), tmp_date.getMonth(), tmp_date.getDate(), tmp_date.getHours(), tmp_date.getMinutes(), tmp_date.getSeconds());
				newgps.save(function(err) {if (err) res.json({'response':"Invalid Information"})
				res.status(200);
				res.json({'response':"ok"});
			});
		}
	});
});
})

//ok
app.post('/app/login',function(req,res){
	if (req.body.email != null && req.body.password != null)
	{
		var email = req.body.email;
		var password = req.body.password;

		login.login(req, function (user) {
			if (user != null) {
				req.session.user_id = user._id;
				randomstring.genetoken(22, 'alphanumeric', function(result) {
					if (result != false)
					{
						user.auth.temp_str = result;
						user.courier.online = true;
						user.save(function(err) {if (err) res.json({'response':"Invalid Information"});
						res.json({'token':user.auth.temp_str});
					})
				}
			})
		}
		else {
			res.status(401);
			res.json({'response':"Invalid Information"});
		}
	});
}
});

//ok
app.post('/app/logout', function (req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		if (user)
	{
			delete req.session.user_id;
			user.auth.temp_str ='';
			user.courier.online = false;
			user.save(function(err) {if (err) res.json({'response':"Invalid Information"});
			res.status(200)
			res.end();
		})
	}
	else
	{
		res.redirect('/app/Error')
	}
});
});


//ok
app.get('/app/profile', checkLoginApp, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		if (user != null)
		res.json(user.details);
	});
});

//OK firtname lastname etc..
app.post('/app/profile', checkLoginApp, function(req, res) {
	User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
		profile.editprofile(req, function(result) {
			//console.log("editprofile", result);
			if (result == false) {res.redirect('/app/Error');}
			else { res.redirect('/app/profile'); }
		});
	});
});

//ok oldpass newpass
app.post('/app/editpassword', checkLoginApp, function(req, res) {
	profile.editpassword(req, function(result) {
		if (result == false) {
			res.redirect('/app/Error');}
		else {res.redirect('/app/profile');}
		});
	});

	//OK email
	app.post('/app/forgot_password', function(req, res) {
		var email = req.body.email;
		chgpass.respass_init(email,function(found){
			if (found.res == false)
				res.redirect('/app/Error');
			else {
				res.end();
			}
		});
	});

	app.get('/app/history_courier',checkLoginAppCourrier, function(req, res) {
		User.findOne({'auth.temp_str' : req.headers.token, 'details.typeuser': 1},function(err,user) {
			if (user){
				moment().locale('fr');
				Course.find({'link.idcourier' : user._id, 'details.termined': true, /*'details.endcoursetime':{$gte: new Date(), $lt: moment().subtract(15, 'days').toISOString()}*/}, function(err, courses) {
					if(err){
						res.redirect('/app/Error');
					}
					else {
						var histoCourier = [];
						nbexecutionsTermine=0;

						if (courses.length == 0)
						res.json(histoCourier);
						else {
							for (var i = 0; i < courses.length; i++)
							{
								var date1 = new Date(courses[i].details.endcoursetime);
								var date2 = new Date();
								var timeDiff = Math.abs(date2.getTime() - date1.getTime());
								var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
								if (diffDays < 16)
								{
									Managecourse.detailssendhistorycourier(courses[i], function(course){
									nbexecutionsTermine++;
									histoCourier.push(course);
									if (nbexecutionsTermine == courses.length)
									{
										histoCourier = sortByKey(histoCourier, 'endcoursetime');
										res.json(histoCourier);
									}
								})
							}
							else{
								res.json(histoCourier);
							}
							}
						}
					}
				})
			}
			else{
				res.redirect('/app/Error');
			}
		});
	})
}

function checkLoginAppCourrier(req, res, next) {
	if (req.headers.token != undefined && req.headers.token != '')
	{
		User.findOne({'auth.temp_str' : req.headers.token, 'details.typeuser': 1},function(err,user) {
			if (user)
			return next();
			else{
				res.redirect('/app/Error');
			}
		});
	}
	else {
		res.redirect('/app/BadToken');
	}
}

function checkLoginApp(req, res, next) {
	if (req.headers.token != undefined && req.headers.token != '')
	{
		User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
			if (user)
				return next();
			else{
				res.redirect('/app/Error');
			}
		});
	}
	else {
		res.redirect('/app/BadToken');
	}
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
