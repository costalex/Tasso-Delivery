var mongoose = require('mongoose');
var configDB = require('../database');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({

  auth              : {
    token				 : String,
    email        : String,
    password     : String,
    salt 				 : String,
    temp_str		 : String
  },

  details           : {
    firstname      : String,
    lastname       : String,
    profesion      : String,
    email          : String,
    phone          : String,
    address        : String,
    iduser         : String,
    idhistory      : String,
    idcompany      : String,
    codesponsor    : String,
    typeuser       : Number, //0 client, 1 courier, 2 company, 3 admin
    countcourse    : Number,
    createtime     : Date,
    connection     : Date,
    newsletter     : Boolean,
  },

  wallet            : {
    balance          : Number,
    historywallet    : String,
  },

  courier           : {
    online           : Boolean,
    available        : Number,
    rib              : String,
    numberae         : String,
    idcourse         : String,
    countcourse      : Number,
    area             : String,
  },

  company          : {
    idreferant      : String,
    idcustomerslist : String,
  },

  sponsor          : {
    code              : String,
    countUser         : Number,
    countUseractif    : Number,
  }
}, {
    usePushEach: true
});

mongoose.connect(configDB.url, {
  useMongoClient: true,
  /* other options */
});

module.exports = mongoose.model('User', userSchema);
