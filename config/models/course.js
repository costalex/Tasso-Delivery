var mongoose = require('mongoose');

// define the schema for our user model
var courseSchema = mongoose.Schema({

  link            : {
    idgps           : String,
    idcourier       : String,
    idcoursenext    : String,
    iduser          : String,
    refcourse       : String,
  },

  address         : {
    idstartaddress      : String,
    idendaddress        : String,
  },

  details         : {
    price             : Number,
    active            : Boolean,
    activecourier     : Boolean,
    distance          : String,
    estimatedtime     : String,
    startcoursetime   : Date,
    endcoursetime     : Date,
    termined          : Boolean,
    validatetime      : Date,
    payvalide         : Boolean,
    step              : Number,
    pricecourier      : Number,
    area              : String,
  },

  recipient       : {
    firstname           : String,
    lastname            : String,
    phone               : String,
    instruction         : String,
  },

  sender          : {
    firstname           : String,
    lastname            : String,
    phone               : String,
    instruction         : String,
  },

  security       : {
    option            : Number, //0 pas d'option 1 code 2 signature
    code              : String,
    signature         : String,
  },
  time      : { type: Date, default: Date.now }
}, {
    usePushEach: true
});

// methods ======================


// create the model for users and expose it to our app
module.exports = mongoose.model('Course', courseSchema);
