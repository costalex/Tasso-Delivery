var mongoose = require('mongoose');
var configDB = require('../database');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var companySchema = mongoose.Schema({

  idadministrateur : String,

  details : {
    firstname : {type: String, default: ""},
    name : {type: String, default: ""},
    siret: {type: String, default: ""},
    sector: {type: String, default: ""},
    phone: {type: String, default: ""},
    address_company: {type: String, default: ""},
    address: {type: String, default: ""},
    zipcode: {type: String, default: ""},
    city: {type: String, default: ""},
    country : {type: String, default: ""},
    email: {type: String, default: ""},
  },

  detailsadmin : {
    firstname : {type: String, default: ""},
    lastname : {type: String, default: ""},
    phone : {type: String, default: ""},
    email : {type: String, default: ""},
    },

  members : {
    type : Array,
    default : []
  },

  members_novalidate : {
    type : Array,
    default : []
  },

  wallet            : {
    tokenStripe      : {type: String, default: ""},
    balance          : Number,
    historywallet    : {type: String, default: ""},
  },

  file          : {
    path_identity :{type: String, default: ""},
    path_urssaf   :{type: String, default: ""},
  },

  validatestate : Boolean,
  code_entreprise :  {type: String, default: ""},
});

  module.exports = mongoose.model('Company', companySchema);
