var User = require('../config/models/user');
var Course = require('../config/models/course');

exports.uploadsignature= function(req, res, callback){
  User.findOne({'auth.temp_str' : req.headers.token},function(err,user) {
    Course.findOne({'link.refcourse': req.body.refcourse, 'details.active': true}, function(err, course) {
      if (course && user)
      {
        course.signature = fs.readFileSync (req.body.image.path);
        course.signature.contentType = 'image/png';
        course.save();
        callback(true);
      }
      else {
        callback(false);
      }
    });
  });
}
