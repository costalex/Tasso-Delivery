var crypto = require('crypto');
var rand = require('csprng');
var mongoose = require('mongoose');
var user = require('../config/models/user');
var check = require('../config/verifinput')
var randomstring = require('../config/geneString');

var soldstart = 0;

function verifregister(req, email, password, typeuser, callback)
{
	var x = email;
	if(!(x.indexOf("@")<1 || x.lastIndexOf(".")<x.indexOf("@")+2 || x.lastIndexOf(".")+2>=x.length))
	{
		user.find({'auth.email': email},function(err,users){
			if (err)
			callback(false);
			if (users.length == 0)
			{
				check.checkvalue(password, 'PASSWORD', function(res) {
					if (res == true && password.length > 5) {
						check.checkvalue(req.body.lastname, 'ALPHANAME', function(res) {
							if (res == true && req.body.lastname.length > 0) {
								check.checkvalue(req.body.firstname, 'ALPHANAME', function(res) {
									if (res == true && req.body.firstname.length > 0) {
										check.checkvalue(req.body.phone, 'NUMERIC', function(res) {
											user.findOne({'details.phone': req.body.phone}, function(err, user) {
												if (!user)
												{
													if(res == true && req.body.phone.length > 0) {
														if (typeuser == 1)
														{
															check.checkvalue(req.body.courier_rib, 'RIBFR', function(res) {
																/*if (res == true && req.body.courier_rib.indexOf("FR") == 0 && req.body.courier_rib.lastIndexOf("FR") == 1 &&
																req.body.courier_rib.length == 27)
																{*/
																	callback(true, null, {'status': 200});
															/*	}
																else {
																	console.log('615: RIB Not Valid');
																	req.flash.type = 'error'
																	callback(false, req.flash('FailureRegister', 'RIB non valide'), {'status': 615});
																}*/
															});
														}
														else {
															callback(true, null, {'status': 200});
														}
													}
													else {
														//console.log('607: Phone Number Not Valid');
														req.flash.type = 'error'
														callback(false, req.flash('FailureRegister', "Numéro de téléphone non conforme"), {'status': 607})
													}
												}
												else {
													//console.log('607: Phone Number already use');
													req.flash.type = 'error'
													callback(false, req.flash('FailureRegister', "Numéro de téléphone déjà utilisé"), {'status': 607})
												}
											});
										});
									}
									else {
										//console.log('608: Firstname Not Valid');
										req.flash.type = 'error'
										callback(false, req.flash('FailureRegister', "Prénom non valide"), {'status': 608})
									}
								});
							}
							else {
								//console.log('608: Lastname Not Valid');
								req.flash.type = 'error'
								callback(false, req.flash('FailureRegister', "Nom non valide"), {'status': 608});
							}
						});
					}
					else {
						//console.log('603: Password is Wrong');
						req.flash.type = 'error'
						callback(false, req.flash('FailureRegister',"Mauvais mot de passe"), {'status': 603});
					}
				});
			}
			else {
				//console.log('605: Email already Registered');
				req.flash.type = 'error'
				callback(false, req.flash('FailureRegister', "Email déjà enregistré"), {'status': 605});
			}
		});
	}
	else{
		//console.log('601: Email Not Valid');
		req.flash.type = 'error'
		callback(false, req.flash('FailureRegister', "Email non valide"), {'status': 601});
	}
}

function verifsponsorcode(req, callback){
	user.findOne({'sponsor.code' : req.body.codesponsor}, function(err, users)
	{
		if (err)
		{
			req.flash.type = 'error'
			callback(false, 0, req.flash('FailureRegister', "Code de parrainage non valide"),{'status': 616})
		}
		else if (users)
		{
			users.sponsor.countUser = users.sponsor.countUser + 1
			callback(true, 0)
		}
		else {
			req.flash.type = 'error'
			callback(false, 0, req.flash('FailureRegister', "Code de parrainage non valide"),{'status': 616})
		}
	})
}

exports.register = function(req, email,password, typeuser,callback)
{
	verifregister(req, email, password, typeuser, function(res, message, status) {
		if(res == true)
		{
			var temp =rand(160, 36);
			var newpass = temp + password;
			var token = crypto.createHash('sha512').update(email +rand).digest("hex");
			var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");

			var newuser = new user();

			newuser.auth.token= token;
			newuser.auth.email= email;
			newuser.auth.password= hashed_password;
			newuser.auth.salt= temp;

			newuser.details.lastname    = req.body.lastname; //
			newuser.details.firstname   = req.body.firstname; //
			newuser.details.profesion		= req.body.profesion;
			newuser.details.phone       = req.body.phone; //
			newuser.details.email       = email; //
			newuser.details.codesponsor = req.body.codesponsor;
			newuser.details.typeuser    = typeuser;
			newuser.details.countcourse = 0
			newuser.details.address			= req.body.address;
			newuser.details.createtime = new Date();
			newuser.details.idcompany = "";
			if (typeuser == 1)
			{
				newuser.courier.idcourier = '';
				newuser.courier.countcourse = 0;
				newuser.courier.rib = req.body.courier_rib;
				newuser.courier.numberae = req.body.numberae;
				newuser.courier.online = false;
				newuser.courier.area = req.body.areaName;
			}
			randomstring.geneSponsorcode(6, 'alphanumeric', function(result) {
				if (result != false) {
					newuser.sponsor.code = result;
					newuser.sponsor.countUser = 0;
					newuser.sponsor.countUseractif = 0;
					if (typeuser == 0)
					{
						//voir le sponsor pour ajout des fond des deux coté
						if (req.body.newsletter_checkbox == 'on')
							newuser.details.newsletter = true;
							else {
								newuser.details.newsletter = false;
							}
						verifsponsorcode(req, function(res, ballance, message, status)
						{
							if (res == true)
							{
								newuser.wallet.balance   = ballance + soldstart;
								newuser.save(function (err)
								{
									if (err)
									callback(err);
									req.flash.type = 'success'
									req.flash('FailureLogin', "Inscription validée")
									callback(true, null, user);
								});
							}
							else {
								if (req.body.codesponsor == undefined || req.body.codesponsor == "")
								{
									newuser.wallet.balance   = soldstart;
									newuser.save(function (err)
									{
										if (err)
										callback(err);
										else {
										req.flash.type = 'success'
										req.flash('FailureLogin', "Inscription validée")
										callback(true, null, user);
									}
									});
								}
								else
								{
									callback(false, status.status);
								}
							}
						});
					}
					else
					{
						newuser.save(function (err)
						{
							if (err)
							callback(err);
							callback(true, status.status);
						});
					}
				}
				else {
					callback(false, status.status);
				}
			});
		}
		else {
			callback(false, status.status);
		}
	});
}
