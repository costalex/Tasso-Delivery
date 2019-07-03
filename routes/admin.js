var multer = require("multer");
var order = require('../config/order');
var Course = require('../config/models/course');
var Company = require('../config/models/company')

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + file.originalname + '-' + Date.now() + '.png')
	}
})

var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@tassodelivery.com',
    pass: '12Omede@51!'
  }
});

var upload = multer({ storage: storage })
var User = require('../config/models/user');
var Address = require('../config/models/address')
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');
var	infoCourse = require('../config/couriermanager');
var register = require('../config/register');
var Area = require('../config/models/area');
var Package = require('../config/models/package');

module.exports = function(app) {

app.get('/admin/registration/courier', checkAdminLogin, function(req, res) {
	Area.find({}, (err, allArea) => {
		if (err)
			res.render('authentication/courier_registration.ejs', {message: req.flash('FailureRegister'), type: req.flash.type, error: undefined, len: 0});
		else
			res.render('authentication/courier_registration.ejs', {message: req.flash('FailureRegister'), type: req.flash.type, areaTab : JSON.stringify(allArea), len: allArea.length});
	})
});

app.post('/admin/registration/courier', checkAdminLogin, function(req,res){
	if (req.body.email != null && req.body.password != null)
	{
		var email = req.body.email;
		var password = req.body.password;
		register.register(req, email, password, 1, function (creat, response, user) {
			if (creat == true)
			{
				res.redirect('/admin/accueil');
			}
			else {
				res.redirect('/admin/registration/courier'); //ajout du message pour savoir l'erreur
			}
		});
	}
	else {
		res.redirect('/admin/registration/courier');
	}
});

app.get('/admin/accueil', checkAdminLogin, function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('admin/accueil.ejs', {message: req.flash('FailureRegister'), type: req.flash.type});
});

app.get('/admin/map', checkAdminLogin, (req, res) => {
	User.find({'details.typeuser' : 1, "courier.online" : true}, (err, allCourier) => {
		if (allCourier)
			{
				let arrayCurrentCourses = [];
				nbexecutionsTermine = 0;
				if (allCourier.length == 0)
					res.json({activeCourier: arrayCurrentCourses, len: arrayCurrentCourses.length});
				else {
					for (var i = 0; i < allCourier.length; i++) {
						infoCourse.couriermanager(allCourier[i], (courierInfo) => {
								if (courierInfo != undefined)
									arrayCurrentCourses.push(courierInfo);
								nbexecutionsTermine++;
								if (nbexecutionsTermine == allCourier.length) {
										res.json({activeCourier: arrayCurrentCourses, len: arrayCurrentCourses.length});
								}
						});
					}
				}
			}
			else
				res.redirect('/index');
	});
});


app.get('/admin/stats', checkAdminLogin, (req, res) => {
	getBaseStats(req, (err, stats) => {
		if (err == false)
		res.render('admin/stats.ejs', {message: req.flash('FailureRegister'), stats: 0});
		else
		res.render('admin/stats.ejs', {message: req.flash('FailureRegister'), stats: JSON.stringify(stats)});
	});
});

app.get('/admin/trackorder', checkAdminLogin, function(req, res) {
  res.render('admin/retrack_order.ejs', {message: req.flash('FailureRegister'), type: req.flash.type});
});

app.get('/admin/trackorder/:refcourse', checkAdminLogin, (req, res) => {
	Course.findOne({'link.refcourse' : req.params.refcourse, 'details.termined' : true}, (err, course) => {
		//console.log(course, req.body);
		if (err || course == null)
			res.json({"Error" :"Course not find or not termined", "len": 0});
		else {
			Gps.find({'idcourse' : course.link.refcourse}, null, {sort: {time : -1}}, (err, gpsTab) => {
				let arrayGps = [];
				for (var i = 0; i < gpsTab.length; i++) {
					arrayGps.push(gpsTab[i].cordo);
				}
				User.findOne({"_id" : course.link.idcourier}, (err, courier) => {
					res.json({"arrayGps" : arrayGps, "len" : arrayGps.length, "firstname" : courier.details.firstname, "lastname" : courier.details.lastname,
										"phone" : courier.details.phone,
										"validateTime" : {
				                day: course.details.validatetime.getDate(),
				                month: course.details.validatetime.getMonth()+1,
				                year: course.details.validatetime.getFullYear(),
				                minute: course.details.validatetime.getMinutes(),
												hour: course.details.validatetime.getHours(),
				              },
										"startTime" : {
				                day: course.details.startcoursetime.getDate(),
				                month: course.details.startcoursetime.getMonth()+1,
				                year: course.details.startcoursetime.getFullYear(),
				                minute: course.details.startcoursetime.getMinutes(),
												hour: course.details.startcoursetime.getHours(),
				              },
										"endTime" : {
				                day: course.details.endcoursetime.getDate(),
				                month: course.details.endcoursetime.getMonth()+1,
				                year: course.details.endcoursetime.getFullYear(),
				                hour: course.details.endcoursetime.getHours(),
				                minute: course.details.endcoursetime.getMinutes(),
				              }
									});
				})
			})
		}
	});
});

	app.get('/admin/profile/:id', checkAdminLogin, (req, res) => {
		User.findOne({'_id' : req.params.id}, (err, profile) => {
			if (err)
				res.json({"Error" :"Courier not find"})
			else {
				Gps.find({'idcourier' : profile._id}, null, {sort: {time : -1}}, (err, gpsTab) => {
					res.json({"lastPos" : gpsTab[0].cordo, "details" : profile.details, "courierDetails" : profile.courier});
				})
			}
		});
	});

app.get('/admin/entreprise', checkAdminLogin, (req, res) => {
	Company.find({"validatestate" : true}, function(err, company_validate) {
		Company.find({"validatestate" : false}, function(err, company_novalidate) {
			res.render('admin/validate_entreprise.ejs', {nb_company_novalidate: company_novalidate.length, nb_company_validate: company_validate.length ,company_validate: company_validate, company_novalidate: company_novalidate})
		})
	})
})

app.post('/admin/entreprise/:id/delete', checkAdminLogin, (req, res) => {
	Company.findOneAndRemove({"_id" : req.params.id}, function(err, company) {
		var mailOptions = {
			from: 'TassoDelivery <noreply@tassodelivery.com>',
			to: company.details.email,
			subject: "Compte entreprise TassoDelivery",
			text: req.body.cause_rejet,
		}
		smtpTransport.sendMail(mailOptions, function(error, response){});

			res.redirect('/admin/entreprise');
		})
})

app.post('/admin/entreprise/:id/validate', checkAdminLogin, (req, res) => {
	Company.findOne({"_id" : req.params.id}, function(err, company) {
		var mailOptions = {
			from: 'TassoDelivery <noreply@tassodelivery.com>',
			to: company.details.email,
			subject: "Compte entreprise TassoDelivery",
			text: "Votre demande de compte entreprise vient d'être validé.",
		}
		smtpTransport.sendMail(mailOptions, function(error, response){});

		company.validatestate = true;
		company.save(function(err) {if (err) throw err
		res.redirect('/admin/entreprise')});
	})
})

app.get('/admin/entreprise/download_identity/:id', checkAdminLogin, function(req, res){
	Company.findOne({"_id" : req.params.id}, function(err, company) {
  var file = company.file.path_identity;
  res.download(file); // Set disposition and send it.
});
});

app.get('/admin/entreprise/download_urssaf/:id', checkAdminLogin, function(req, res){
	Company.findOne({"_id" : req.params.id}, function(err, company) {
		var file = company.file.path_urssaf;
		res.download(file); // Set disposition and send it.
	});
});
}

function getBaseStats(req, next) {
	let nbPackSale = 0;
	let nbPremiumPackSale = 0;
	let nbEntreprisePackSale = 0;
	User.find({'details.typeuser' : 0}, (err, clients) => {
		let arrayClientsMonth = [];
		let arrayClientsDay = [];
		for (let i = 0; i < clients.length; i++) {
			let date1 = new Date(clients[i].details.createtime);
			let date2 = new Date();
			let timeDiff = Math.abs(date2.getTime() - date1.getTime());
			let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if (diffDays < 32)
				arrayClientsMonth.push(clients[i]);
			if (diffDays == 1)
				arrayClientsDay.push(clients[i]);
			Package.find({'iduser' : clients[i]._id}, (err, clientPakage) => {
				let arrayPackNonth = [];
				for (let i = 0; i < clientPakage.length; i++) {
					let date1 = new Date(clientPakage[i].time);
					let date2 = new Date();
					let timeDiff = Math.abs(date2.getTime() - date1.getTime());
					let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
					if (diffDays < 32)
						arrayPackNonth.push(clientPakage[i]);
					if (clientPakage[i].details.name == "Premium")
						nbPremiumPackSale++;
					if (clientPakage[i].details.name == "Entreprise")
						nbEntreprisePackSale++;
					}
				nbPackSale += arrayPackNonth.length;
			})
		}
		Course.find({}, (err, courses) => {
			let arrayCoursesMonth = [];
			let arrayCoursesDay = [];
			for (let i = 0; i < courses.length; i++) {
				let date1 = new Date(courses[i].time);
				let date2 = new Date();
				let timeDiff = Math.abs(date2.getTime() - date1.getTime());
				let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				if (diffDays < 32)
					arrayCoursesMonth.push(courses[i]);
				if (diffDays == 1)
					arrayCoursesDay.push(courses[i]);
				}
			Course.find({'details.termined' : true}, (err, coursesTermined) => {
				Course.find({'details.termined' : false, 'details.activecourier': false}, (err, currentCourses) => {
					Course.find({'details.termined' : false, 'details.activecourier': true}, (err, coursesNotTake) => {
						if (err)
							next(false);
						let info = {allCourses : courses.length, coursesTermined : coursesTermined.length, currentCourses : currentCourses.length,
												nbCoursesMonth : arrayCoursesMonth.length, nbCoursesDay : arrayCoursesDay.length, nbClients : clients.length,
												coursesNotTake : coursesNotTake.length, nbClientsMonth : arrayClientsMonth.length, nbClientsDay : arrayClientsDay.length,
												nbPackSaleMonth : nbPackSale, nbEntreprisePackSale : nbEntreprisePackSale, nbPremiumPackSale : nbPremiumPackSale}
						next(true, info);
					})
				})
			})
		})
	});
}

function checkAdminLogin(req, res, next) {
	User.findOne({'_id' : req.session.user_id}, (err, user) => {
		if (user != null && user.details.typeuser == 3)
			next();
		else
			res.redirect('/');
	})
}
