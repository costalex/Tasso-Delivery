//var distance = require('google-distance');
var distance = require('google-distance-matrix');
//var geocoder = require('geocoder');
var Address = require('../config/models/address');
var Area = require('../config/models/area');
var ManagerArea = require('../config/manageArea');
var sleep = require('sleep');

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyC9OlnDVBjsKhJXrbvRBup_BJ6208mYrRc', // for Mapquest, OpenCage, Google Premier
  formatter: null,         // 'gpx', 'string', ...
};

distance.key('AIzaSyC9OlnDVBjsKhJXrbvRBup_BJ6208mYrRc');
distance.units('metric');
distance.language('fr');
distance.mode('bicycling');

var geocoder = NodeGeocoder(options);

//distance.apikey = 'AIzaSyDCEWAF3Re-4o5idk0eqA-mMpA-LdLDh_s';

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2, callback) {
  var R = 6378137; // Earth’s mean radius in meter
  lat_a = rad(p1.latitude);
  lon_a = rad(p1.longitude);
  lat_b = rad(p2.lat);
  lon_b = rad(p2.lng);
  d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))

  callback(d);// returns the distance in meter
};

var verifZone = function(origins, destinations, area, callback)
{
  geocoder.geocode(origins, function(err, coordinates){
  //  console.log(coordinates, "Error" + err);
    if (coordinates !== undefined){
      getDistance(coordinates[0], area.centerZone, function(distanceValue) {
        if (distanceValue > area.distanceCenter)
        {
          callback(false);
        }
        else {
          geocoder.geocode(destinations, function(err, coordinates){
            if (coordinates.status === 'OVER_QUERY_LIMIT')
              callback(false);
            else if (coordinates != undefined){
              getDistance(coordinates[0], area.centerZone, function(distanceValue) {
                if (distanceValue > area.distanceCenter)
                {
                  callback(false);
                }
                else {
                  callback(true, area.name);
                }
              });
            }
            else
            callback(false);
          });
        }
      });
    }
    else
    callback(false);
  });
};

exports.distances = function(origins, destinations, callback) {
  Area.find({}, (err, allArea) => {
    if (err)
    ManagerArea.initArea();
    let nbexecutionsTermine = 0;
    for (var i = 0; i < allArea.length; i++) {
      nbexecutionsTermine++;
      verifZone(origins, destinations, allArea[0], function(res, areaName) {
        if (res == true) {
                        var tmp1 = [];
                        tmp1.push(origins);
                        var tmp2 = [];
                        tmp2.push(destinations);
                        distance.matrix(tmp1, tmp2, function (err, distances) {
                            if (err || !distances) {
                                callback(false, {'response' : "Adresse expéditeur et/ou destinataire hors de la zone desservie"}, null);
                            }
                            if (distances.status === 'OK') {
                                callback(null, distances.rows[0].elements[0], areaName);
                    }
                });
            }
              else if (nbexecutionsTermine == allArea.length){
                //console.log("distance verif", err);
                callback(false, {'response' : "Adresse expéditeur et/ou destinataire hors de la zone desservie"}, null);
              }
            });
          }
        });
      };
