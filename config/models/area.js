var mongoose = require('mongoose');

var areaSchema = mongoose.Schema({
  name            : String,
  centerZone    : {
    lat           : Number,
    lng           : Number,
  },
  distanceCenter  : Number,
});

module.exports = mongoose.model('Area', areaSchema);
