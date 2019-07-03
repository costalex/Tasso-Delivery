var User = require('./models/user');
var Address = require('./models/address')
var Course = require('./models/course');
var Gps = require('./models/gps');
var	infoCourse = require('./couriermanager');
var register = require('./register');
var Area = require('./models/area');
var Package = require('./models/package');
var Company = require('./models/company')

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


exports.create = function(req, res) {
  Company.findOne({"details.siret":req.body.entreprise_SIRET}, function(err, company) {
    if (err) {
      req.flash('FailureCompany', "Erreur lord de la création de l'entreprise");
      req.flash.type = 'error'
      res.render('../views/entreprise/create_account.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
    }
    if (company)
    {
      req.flash('FailureCompany', "L'entreprise existe déjà");
      req.flash.type = 'error'
      res.render('../views/entreprise/create_account.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
    }
    else {
      var newCompany = new Company();

      if (details_company(newCompany, req)) {
        if (details_referant(newCompany, req))
        {
          req.flash('CompanySuccess', "L'entreprise a été créer avec success");
          req.flash.type = 'success'
          res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : newCompany, message : req.flash('CompanySuccess'), type: req.flash.type})
        }
        else {
          res.render('../views/entreprise/create_account.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
        }
      }
        else {
          res.render('../views/entreprise/create_account.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
        }
      }
    })

}

exports.addaccount = function(req, res) {
  Company.findOne({"details.siret":req.body.entreprise_SIRET}, function(err, company) {
    if (err) {
      req.flash('FailureCompany', "Erreur lord de l'ajout d'un membre à l'entreprise");
      req.flash.type = 'error'
      res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
    }
    if (company){
      User.findOne({"auth.email" : req.body.associate_email}, function(err, user) {
        if (err) {
          req.flash('FailureCompany', "Erreur lord de l'ajout de membres");
          req.flash.type = 'error'
          res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
        }
        if (user && user.details.idcompany == "") {
          var mailOptions = {
            from: 'Tasso <noreply@tassodelivery.com>',
            to: user.auth.email,
            subject: 'Invitation compte entreprise',
            text: "Bonjour,\nVous avez été inviter par "+ company.detailsadmin.firstname + company.detailsadmin.lastname +"à rejoindre le compte entreprise de "+ company.details.name +" afin de réaliser des courses sur la plateforme Tasso.\n Connectez vous a l'adresse suivant : https://www.tassodelivery.com .\n\nL' équipe Tasso"
          }
          smtpTransport.sendMail(mailOptions, function(error, response){});
          req.flash('SuccessCompany', "Membre ajouté à " + company.details.name);
          req.flash.type = 'success'
          user.details.idcompany = company._id;
          company.members.push({id:user._id, firstname: user.details.firstname, lastname: user.details.lastname});
          company.save(function (err)
          {
            if (err){
              req.flash('FailureCompany', "Erreur lord de l'ajout de membre à l'entreprise");
              req.flash.type = 'error'
              res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
            }
            else {
              user.save(function (err)
              {
                if (err){
                  req.flash('FailureCompany', "Erreur lord de l'ajout de membre à l'entreprise");
                  req.flash.type = 'error'
                  res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
                }
                else {
                  res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
                }
              })
            }
          })
        }
          else {
            req.flash('FailureCompany', "Membre non inscrit ou ce membre fait déjà parti d'une entreprise");
            req.flash.type = 'error'
            res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
          }
        })
      }
  })
}

exports.suppaccount = function(req, res) {
  Company.findOne({"details.siret":req.body.entreprise_SIRET, "validate" : true}, function(err, company) {
    if (err) {
      req.flash('FailureCompany', "Erreur lord de l'ajout d'un membre à l'entreprise");
      req.flash.type = 'error'
      res.render('../views/entreprise/profile_entreprise.ejs', {entreprise : req.body, message : req.flash('FailureCompany'), type: req.flash.type})
    }
    if (company){

    }
  })
}

function details_company(company, req) {
  company.details.name = req.body.entreprise_name
  company.details.siret = req.body.entreprise_SIRET
  company.details.sector = req.body.entreprise_sector
  company.details.phone = req.body.entreprise_phone
  company.details.address = req.body.entreprise_address
  company.details.zipcode = req.body.entreprise_address_zipcode
  company.details.city = req.body.entreprise_address_city
  company.details.country = req.body.entreprise_address_country
  company.details.email = req.body.entreprise_email

  newCompany.wallet.balance = 0;

  company.save(function (err)
  {
    if (err) {
      req.flash('FailureCompany', "Erreur lord de la création de l'entreprise");
      req.flash.type = 'error'
      return false;
    }
    else {
      return true;
    }
  });
}

function details_referant(company, req) {
  company.detailsadmin.firstname = req.body.entreprise_referent_firstname
  company.detailsadmin.lastname = req.body.entreprise_referent_lastname
  company.detailsadmin.phone = req.body.entreprise_referent_phone
  company.detailsadmin.email = req.body.entreprise_referent_email

  company.save(function (err)
  {
    if (err){
     req.flash('FailureCompany', "Erreur lord de la création de l'entreprise");
     req.flash.type = 'error'
     return false;
   }
   else {
     return true;
   }
  });
}
