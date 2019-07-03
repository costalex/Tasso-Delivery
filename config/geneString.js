var randomstring = require("randomstring");
var Course = require('../config/models/course');
var User = require('../config/models/user');
var Package = require('../config/models/package');

exports.geneString = function(len, charsetop, callback) {
  var ref = randomstring.generate(
    {length:len,
      charset:charsetop,
      capitalization:'uppercase'})
      Course.findOne({'refcourse' : ref}, function(err, refvalide)
      {
        if (err)
        callback(false);
        if (refvalide)
        geneString(len, charsetop, callback);
        else {
          callback(ref);
        }
      });
    };

    exports.geneStringPackage = function(len, charsetop, callback) {
      var ref = randomstring.generate(
        {length:len,
          charset:charsetop,
          capitalization:'uppercase'})
          Package.findOne({'refpackage' : ref}, function(err, refvalide)
          {
            if (err)
            callback(false);
            if (refvalide)
            geneString(len, charsetop, callback);
            else {
              callback(ref);
            }
          });
        };

        exports.genetoken = function(len, charsetop, callback) {
          var ref = randomstring.generate(
            {length:len,
              charset:charsetop,
              capitalization:'uppercase'})
              User.findOne({'auth.temp_str' : ref}, function(err, refvalide)
              {
                if (err)
                callback(false);
                if (refvalide)
                genetoken(len, charsetop, callback);
                else {
                  callback(ref);
                }
              });
            };

            exports.geneSponsorcode = function(len, charsetop, callback) {
              var ref = randomstring.generate(
                {length:len,
                  charset:charsetop,
                  capitalization:'uppercase'})
                  User.findOne({'sponsor.code' : ref}, function(err, refvalide)
                  {
                    if (err)
                    callback(false);
                    if (refvalide)
                    geneString(len, charsetop, callback);
                    else {
                      callback(ref);
                    }
                  });
                };
