var mongoose = require('mongoose');

// define the schema for our user model
var gpsSchema = mongoose.Schema({
  idcourse        : String,
  idcourier       : String,

  cordo            : {
    lng     : {type: Number},
    lat      : {type: Number},
  },

  time : { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Gps', gpsSchema);
