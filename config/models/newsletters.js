var mongoose = require('mongoose');

// define the schema for our user model
var newsletterSchema = mongoose.Schema({

  email : String,
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('Newsletter', newsletterSchema);
