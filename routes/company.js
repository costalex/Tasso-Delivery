
var CompanyController = require('../config/companymanager')
var User = require('../config/models/user');
var Address = require('../config/models/address')
var Course = require('../config/models/course');
var Gps = require('../config/models/gps');
var	infoCourse = require('../config/couriermanager');
var register = require('../config/register');
var Area = require('../config/models/area');
var Package = require('../config/models/package');
var Company = require('../config/models/company')
var formidable = require('formidable');
var fs = require('fs');
var pathfiles = "/Document/tassodev/companydocument/";
var path = require('path');
var randomstring = require('../config/geneString');
var multiparty = require('multiparty');
var simple_recaptcha = require('simple-recaptcha-new');
var check = require('../config/verifinput')
var slackbot  = require('../config/slackBot');
var Packagelist = require('../config/models/packagelist');
var Package = require('../config/models/package');
var Managepackage = require('../config/managePackage');


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


module.exports = function(app) {

	app.get('/entreprise_profile', checkLogin, function(req, res) {
    User.findOne({'_id' : req.session.user_id},function(err,user) {
      if(user.details.idcompany) {
        Company.findOne({"idadministrateur":user._id}, function(err, company) {
          Managepackage.initPackage(function() {
            Packagelist.findOne({"details.name": "Pack pro"}, function(err, package1) {
              Packagelist.findOne({"details.name": "Pack entreprise"}, function(err, package2) {
                if (company.validatestate == false){
                  req.flash('FailureCompany', "Entreprise en cours de validation.");
                  req.flash.type = 'warning';
                  res.render('../views/entreprise/profile_entreprise.ejs', {email: user.details.email, balance : user.wallet.balance, package1 : package1.details, package2 : package2.details, entreprise : company, message : req.flash('FailureCompany'), type: req.flash.type}); //page attente de validation
                }
                else {
                  res.render('../views/entreprise/profile_entreprise.ejs', {email: user.details.email,balance : user.wallet.balance, package1 : package1.details, package2 : package2.details, entreprise : company, message : req.flash('FailureCompany'), type: req.flash.type});
                }
              })
            })
          })
        })
      }
      else {
        res.redirect('/entreprise')
      }
    })
	})

	app.post('/entreprise_profile', checkLogin, function(req, res) {
		User.findOne({'_id' : req.session.user_id},function(err,user) {
			if(user.details.idcompany) {
				Company.findOne({"idadministrateur":user._id}, function(err, company) {
					verifedit(req, req.body, company, function(result, messages, status) {
						if (result == true) {
							company.save(function (err)
							{
								if (err){
									req.flash('FailureCompany', "Erreur lors de la modification de l'entreprise.");
									req.flash.type = 'error'
									res.redirect('/entreprise_profile')
								}
								else {
									res.redirect('/entreprise_profile')
								}
							});
						}
						else {
							res.redirect('/entreprise_profile')
						}
					})
				})
			}
		});
	})

	app.get('/entreprise', checkLogin, function(req, res) {
		User.findOne({'_id' : req.session.user_id},function(err,user) {
			if(user.details.idcompany) {
				res.redirect('/entreprise_profile')
			}
			else {
				res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance, entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type});
			}
		})
	})

	app.post('/entreprise', checkLogin, function(req, res) {
		var form = new multiparty.Form();
		form.parse(req, function(err, fields, files) {
			User.findOne({'_id' : req.session.user_id},function(err,user) {
				verifregister(req, fields, function(result, messages, status) {
					if (result == true) {
						simple_recaptcha('6LekOzAUAAAAAFlxOHiAeOuKz9_CWXT1HlGuOrnK', fields['g-recaptcha-response'], (error) => {

							if (error) {
								//console.log(error, req.body);
								res.redirect('/logout')
							}
							else {
								if (user) {

									Company.findOne({"details.siret":fields.entreprise_SIRET}, function(err, company) {
										if (err) {
											req.flash('FailureCompany', "Erreur lors de la création de l'entreprise.");
											req.flash.type = 'error'
											res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance,entreprise : fields, message : req.flash('FailureCompany'), type: req.flash.type})
										}
										if (company)
										{
											req.flash('FailureCompany', "L'entreprise existe déjà.");
											req.flash.type = 'error'
											res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance,entreprise : fields, message : req.flash('FailureCompany'), type: req.flash.type})
										}
										else {
											var newCompany = new Company();

											details_company(newCompany, files, fields, req, function(err) {
												if (err) {
													res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance,entreprise : fields, message : req.flash('FailureCompany'), type: req.flash.type})
												}
												else {

													details_referant(newCompany, user, fields, req ,function(err) {

														if (err) {
															res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance,entreprise : fields, message : req.flash('FailureCompany'), type: req.flash.type})
														}
														else {
															var mailOptions = {
																from: 'NewCompany <noreply@tassodelivery.com>',
																to: 'new-company@tassodelivery.com',
																subject: 'New Company ' + fields.entreprise_name,
																text: fields.entreprise_name + " souhaite utiliser les services de Tasso.\n" +
																"Email entreprise : " + fields.entreprise_email + "\n Email utilisateur :" + user.auth.email + "\n" +
																	"SIRET : " +fields.entreprise_SIRET+ "\n" +
																	"Sector : " +fields.entreprise_sector+ "\n" +
																	"Phone : " +fields.entreprise_phone+ "\n" +
																	"Address : " +fields.entreprise_address+ "\n" +
																	"Zipcode : " +fields.entreprise_address_zipcode+ "\n" +
																	"City : " +fields.entreprise_address_city+ "\n" +
																	"Country : " +fields.entreprise_address_country+ "\n",
																/*attachments: [{
																	filename: fields.entreprise_name +"_URSSAF_" + files.file2[0].originalFilename,
																	path: path.join(process.env.PWD, '/companydocument/', fields.entreprise_name +"_URSSAF_" + files.file2[0].originalFilename),
																	contentType: 'application/pdf'
																},
																{
																	filename : fields.entreprise_name + "_identity_card_" + files.identity_card[0].originalFilename,
																	path: path.join(process.env.PWD, '/companydocument/', fields.entreprise_name + "_identity_card_" + files.identity_card[0].originalFilename),
																	contentType: 'application/pdf'
																}
															]*/
															}

															smtpTransport.sendMail(mailOptions, function(error, response){});
															slackbot.saymsgCompany(user.auth.email + " has created a new company : " + fields.entreprise_name);
															res.redirect('/entreprise');
														}
													})
												}
											})
										}
									})
								}
								else {
									req.flash('FailureCompany', "L'entreprise existe déjà.");
									req.flash.type = 'error'
									res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance,entreprise : fields, message : req.flash('FailureCompany'), type: req.flash.type})
								}
							}
						});
					}
					else {
						res.render('../views/entreprise/create_account.ejs', {balance : user.wallet.balance, entreprise : fields,	 message : messages,	 type: status.status})
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

function details_company(company, files, fields, req, callback) {
	company.details.firstname = fields.entreprise_name
	company.details.name = fields.entreprise_name
	company.details.siret = fields.entreprise_SIRET
	company.details.sector = fields.entreprise_sector
	company.details.phone = fields.entreprise_phone
	company.details.address_company = fields.entreprise_address
	company.details.address = fields.entreprise_address + "\n " + fields.entreprise_address_zipcode + ", "+fields.entreprise_address_city + ", " + fields.entreprise_address_country
	company.details.zipcode = fields.entreprise_address_zipcode
	company.details.city = fields.entreprise_address_city
	company.details.country = fields.entreprise_address_country
	company.details.email = fields.entreprise_email
	company.validatestate = true
	company.wallet.balance = 0;
	callback(false);
/*if (files.identity_card[0] != undefined || files.file2[0] != undefined)
{
	var oldpath = files.identity_card[0].path;
	fs.readFile(oldpath, function (err, data) {
		if (err) throw err;

		// Write the file
		var newpath = path.join(process.env.PWD, '/companydocument/', fields.entreprise_name + "_identity_card_" + files.identity_card[0].originalFilename );
		company.file.path_identity = newpath;
		fs.writeFile(newpath, data, function (err) {
			if (err) throw err;
		});

		// Delete the file
		var oldpath = files.identity_card[0].path;
		fs.unlink(oldpath, function (err) {
			if (err) throw err;
		});
		var oldpath = files.file2[0].path;
		fs.readFile(oldpath, function (err, data) {
			if (err) throw err;

			// Write the file
			var newpath = path.join(process.env.PWD, '/companydocument/', fields.entreprise_name +"_URSSAF_" + files.file2[0].originalFilename);
			company.file.path_urssaf = newpath;
			fs.writeFile(newpath, data, function (err) {
				if (err) throw err;
				callback(false);
			});

			// Delete the file
			var oldpath = files.file2[0].path;
			fs.unlink(oldpath, function (err) {
				if (err) throw err;
			});
		});
	})
}
else {
  callback(false)
}*/
}

function details_referant(company, user, fields, req,callback) {
	company.detailsadmin.firstname = user.details.firstname
	company.detailsadmin.lastname = user.details.lastname
	company.detailsadmin.phone = user.details.phone
	company.detailsadmin.email = user.details.email
	if (user.details.idcompany)
	{
		req.flash('FailureCompany', "Vous disposez déjà d'une entreprise.");
		req.flash.type = 'error'
		callback(true);
	}
	else {
		user.details.idcompany = company._id;
		company.idadministrateur = user._id;
		randomstring.geneSponsorcode(6, 'alphanumeric', function(result) {
			company.code_entreprise = result;
			user.save(function (err) {
				if (err){
					req.flash('FailureCompany', "Erreur lors de la création de l'entreprise.");
					req.flash.type = 'error'
					callback(true);
				}
				else {
					company.save(function (err)
					{
						if (err){
							req.flash('FailureCompany', "Erreur lors de la création de l'entreprise.");
							req.flash.type = 'error'
							callback(true);
						}
						else {
							callback(false);
						}
					});
				}
			})
		})
	}
}

function verifregister(req, fields, callback) {
	var x = fields.entreprise_email[0];
	if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length))
	{
		Company.find({'details.email': fields.entreprise_email},function(err,companys){
			if (err)
			callback(false);
			if (companys.length == 0)
			{
				check.checkvalue(fields.entreprise_SIRET[0], 'NUMERIC', function(res) {
					if (res == true && fields.entreprise_SIRET[0].length == 14) {
						check.checkvalue(fields.entreprise_name[0], 'COMPANYNAME', function(res) {
							if (res == false && fields.entreprise_name[0].length > 0) {
								check.checkvalue(fields.entreprise_sector[0], 'ALPHANAME', function(res) {
									if (res == true && fields.entreprise_sector[0].length > 0) {
										check.checkvalue(fields.entreprise_phone[0], 'NUMERIC', function(res) {
											Company.findOne({'details.phone': fields.entreprise_phone[0]}, function(err, company) {
												if (!company)
												{
													if(res == true && fields.entreprise_phone[0].length > 0) {
														//console.log("check ok");
															callback(true, null, {'status': 200});
													}
													else {
														//console.log('607: Phone Number Not Valid');
														req.flash.type = 'error'
														callback(false, req.flash('FailureCompany', "Numéro de téléphone non conforme"), {'status': 607})
													}
												}
												else {
													//console.log('607: Phone Number already use');
													req.flash.type = 'error'
													callback(false, req.flash('FailureCompany', "Numéro de téléphone déjà utilisé"), {'status': 607})
												}
											});
										});
									}
									else {
										//console.log('609: sector Not Valid');
										req.flash.type = 'error'
										callback(false, req.flash('FailureCompany', "sector non valide"), {'status': 608})
									}
								});
							}
							else {
								//console.log('608: name Not Valid');
								req.flash.type = 'error'
								callback(false, req.flash('FailureCompany', "Nom non valide"), {'status': 608});
							}
						});
					}
					else {
						//console.log('603: siret is Wrong');
						req.flash.type = 'error'
						callback(false, req.flash('FailureCompany',"SIRET non valide"), {'status': 603});
					}
				});
			}
			else {
				//console.log('605: Email already Registered');
				req.flash.type = 'error'
				callback(false, req.flash('FailureCompany', "Email déjà enregistré"), {'status': 605});
			}
		});
	}
	else{
		//console.log('601: Email Not Valid');
		req.flash.type = 'error'
		callback(false, req.flash('FailureCompany', "Email non valide"), {'status': 601});
	}
}

function verifedit(req, fields, companys, callback) {
	if (fields.entreprise_address_company != '')
	company.details.address_company = fields.entreprise_address
	if (fields.entreprise_address_zipcode != '')
	company.details.zipcode = fields.entreprise_address_zipcode
	if (fields.entreprise_address_city != '')
	company.details.city = fields.entreprise_address_city
	if (fields.entreprise_address_country != '')
	company.details.country = fields.entreprise_address_country
	company.details.address = company.details.address_company + "\n " + company.details.zipcode + ", "+company.details.city + ", " + company.details.country
	var x = fields.entreprise_email;
	if (fields.entreprise_email != '') {
		if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length))
		{
			companys.details.email = fields.entreprise_email
			if(fields.entreprise_phone != '') {
				check.checkvalue(fields.entreprise_phone, 'NUMERIC', function(res) {
					if(res == true && fields.entreprise_phone.length > 0) {
						companys.details.phone = fields.entreprise_phone
						callback(true, "modification réalisé", {'status': 'success'});
					}
				})
			}
		}
		else {
			if(fields.entreprise_phone != '') {
				check.checkvalue(fields.entreprise_phone, 'NUMERIC', function(res) {
					if(res == true && fields.entreprise_phone.length > 0) {
						companys.details.phone = fields.entreprise_phone
						callback(true, "modification réalisé", {'status': 'success'});
					}
				})
			}
		}
	}
	if(fields.entreprise_phone != '') {
		check.checkvalue(fields.entreprise_phone, 'NUMERIC', function(res) {
			if(res == true && fields.entreprise_phone.length > 0) {
				companys.details.phone = fields.entreprise_phone
				callback(true, "modification réalisé", {'status': 'success'});
			}
		})
	}
}
