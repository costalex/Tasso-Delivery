var Gps = require('./models/gps');

exports.couriermanager = function (currentCourier, next) {
  Gps.find({'idcourier' : currentCourier._id}, null, {sort: {time : -1}}, function (err, lastGps) {
    if(lastGps.length > 0) {  var courierInfo = {id: currentCourier._id, details: currentCourier.details,
                        courier: currentCourier.courier, gps: lastGps[0].cordo};
      next(courierInfo);
    }
    else {
      next();
    }
   });
}
