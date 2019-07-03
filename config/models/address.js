var mongoose = require('mongoose');

// define the schema for our user model
var addressSchema = mongoose.Schema({
  name            :String,
  city            :String,
  details         : {
    lng           :Number,
    lat           :Number,
  },

  iduser          : String, //pour faire un histo des addresse de l'utilisateur
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('Address', addressSchema);
