var mongoose = require('mongoose');

// define the schema for our user model
var packageSchema = mongoose.Schema({

  details           : {
    name           : String,
    price          : Number,
    priceht        : Number,
    value          : Number,
    stripe_price   : Number,
    nb_courses     : Number,
  },
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('Packagelist', packageSchema);
