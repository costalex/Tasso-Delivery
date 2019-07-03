var Area = require('../config/models/area');

exports.initArea = function()
{
  var area1 = new Area();
  var area2 = new Area();

  area1.name = 'Bordeaux';
  area1.centerZone.lat = 44.836586;
  area1.centerZone.lng = -0.598951;
  area1.distanceCenter = 5200;

  // area2.name = 'Toulouse';
  // area2.centerZone.lat = 43.598441;
  // area2.centerZone.lng = 1.439362;
  // area2.distanceCenter = 5200;

  Area.findOne({"name": "Bordeaux"}, function(err, areaFind) {
    if (!areaFind)
      area1.save(function(err) {	if (err) res.json({'response':"Erreur sauvegarde de la zone"});
    });
  });
  // Area.findOne({"name": "Toulouse"}, function(err, areaFind) {
  //   if (!areaFind)
  //     area2.save(function(err) {	if (err) res.json({'response':"Erreur sauvegarde de la zone"});
  //   });
  // });
}
