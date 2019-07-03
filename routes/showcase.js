var nodemailer = require('nodemailer');
var ejs = require('ejs');
var smtpTransport = nodemailer.createTransport({
	host: 'ssl0.ovh.net',
	port: 465,
	secure: true,
	auth: {
		user: 'noreply@tassodelivery.com',
		pass: '12Omede@51!'
	}
});

var sm = require('sitemap');
var sitemap = sm.createSitemap ({
      hostname: 'https://tassodelivery.com',
      cacheTime: 600000,        // 600 sec - cache purge period
      urls: [
        { url: '/',  changefreq: 'daily', priority: 1.00 },
        // { url: '/tarifs',  changefreq: 'daily',  priority: 0.80 },
        { url: '/villes',  changefreq: 'daily',  priority: 0.80 },    // changefreq: 'weekly',  priority: 0.5
        { url: '/login',  changefreq: 'daily',  priority: 0.80 },
				{ url: '/registration',  changefreq: 'daily',  priority: 0.80 },
				{ url: '/faq',  changefreq: 'daily',  priority: 0.80 },
				{ url: '/contact',  changefreq: 'daily',  priority: 0.80 },
				{ url: '/cgu',  changefreq: 'daily',  priority: 0.80 }
		]
    });
var Newsletter = require('../config/models/newsletters');

module.exports = function(app) {


	app.get('/sitemap.xml', function(req, res) {
	  sitemap.toXML( function (err, xml) {
	      if (err) {
	        return res.status(500).end();
	      }
	      res.header('Content-Type', 'application/xml');
	      res.send( xml );
	  });
	});
	//SHAWCASE///////////////////////////////////////////////////////////
	app.get('/', function(req, res) {
		res.redirect('/index'); // load the index.ejs file
	});
	// HOME PAGE (with login links)
	app.get('/index', function(req, res) {
		res.render('new_showcase/index.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the index.ejs file
		//res.render('showcase/maintenance.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the maintenance.ejs file
	});

	app.get('/politique_confidentialite', function(req, res) {
		res.render('new_showcase/politiqueconfidentialite.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the faq.ejs file
	});

	//FAQ PAGE
	app.get('/faq', function(req, res) {
		res.render('new_showcase/faq.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the faq.ejs file
	});

	app.get('/cgu', function(req, res) {
		res.render('new_showcase/cgu.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the faq.ejs file
	});

	//PRICE_PAGE
	// app.get('/tarifs', function(req, res) {
	// 	res.render('new_showcase/tarifs.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the price_page.ejs file
	// });

	//BECOME COURIER
	app.get('/villes', function(req, res) {
		res.render('new_showcase/villes.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the become_courier.ejs file
	});

	//ABOUT
	app.get('/about', function(req, res) {
		res.render('new_showcase/about.ejs', {message: req.flash('newsletter'), type: req.flash.type}); // load the become_courier.ejs file
	});

	//CONTACT
	app.get('/contact', function(req, res) {
		res.render('new_showcase/contact.ejs', {message: req.flash('Contact'), type: req.flash.type, newsletter: req.flash('newsletter')}); // load the contact.ejs file
	});

	app.post('/contact', function(req, res){
		var mailOptions = {
			from: 'ContactPage <noreply@tassodelivery.com>',
			to: 'contact@tassodelivery.com',
			subject: "Contactez-nous",
			text: "De: "+req.body.lastname+" "+req.body.firstname+" <"+req.body.email+ ">\n"
			+ "Objet: " + req.body.subject + "\n\n"
			+ req.body.comment,

		}
		if (req.body.comment != "" && req.body.email != "")
		{
			smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				req.flash("Contact", "Erreur lors de l'envoi!")
				req.flash.type = 'error'
				res.redirect('/contact');

			}else{
				req.flash("Contact", "Votre message a bien été envoyé!")
				req.flash.type = 'success'
				res.redirect('/contact');

			}
			});
		}else{
			req.flash("Contact", "Erreur lors de l'envoi!")
			req.flash.type = 'error'
			res.redirect('/contact');
		}
	});

	app.post('/:page/newsletter', function(req, res){
		var email = req.body.newsletter_mail;
		var url = req.params.page;
		var x = email;
		if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length))
		{
			Newsletter.find({'email': email}, function(err, emails) {
				if (emails.length > 0 || err){
					req.flash("newsletter", "Vous êtes déjà inscrit à notre newsletter");
					req.flash.type = 'info';
					res.redirect('/'+url);
				}
				else {
					var newsletter = new Newsletter();

					newsletter.email = email;
					newsletter.save(function (err) { if (err) res.redirect('/');
					else {
						req.flash("newsletter", "Vous êtes bien inscrit à notre newsletter");
						req.flash.type = 'success';
						res.redirect('/'+url);
					}
				});
			}
		});
	}
	else {
		req.flash("newsletter", "Vous avez rentrer un email invalide");
		req.flash.type = 'error';
		res.redirect('/'+url);
	}
});
};
