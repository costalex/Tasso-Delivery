var Packagelist = require('../config/models/packagelist');

exports.initPackage = function(next)
{

  var package1 = new Packagelist();
  var package2 = new Packagelist();

  package1.details.name = "Pack pro";
  package1.details.priceht = 50;
  package1.details.price = 60;
  package1.details.value = 60;
  package1.details.stripe_price = 6000;
  //package1.details.nb_courses = package1.details.priceht / 12.90;

  package2.details.name = "Pack entreprise";
  package2.details.priceht = 100;
  package2.details.price = 120;
  package2.details.value = 120;
  package2.details.stripe_price = 12000;
  //package2.details.nb_courses = package2.details.priceht / 11.90;

  Packagelist.findOne({"details.name": package1.details.name}, function(err, packagefind) {
    if (packagefind)
    {
      Packagelist.findOne({"details.name": package2.details.name}, function(err, packagefind2) {
        if(!packagefind2)
        {
          package2.save(function(err) {	if (err) res.json({'response':"Erreur sauvegarde du forfait"});
          next();
        });
      }
      next();
    });
  }
  else {
    package1.save(function(err) {	if (err) res.json({'response':"Erreur sauvegarde du forfai"});
    Packagelist.findOne({"details.name": package2.details.name}, function(err, packagefind2) {
      if(!packagefind2)
      {
        package2.save(function(err) {	if (err) res.json({'response':"Erreur sauvegarde du forfai"});
        next();
      });
    }
    next();
  });
});
}
});
}
