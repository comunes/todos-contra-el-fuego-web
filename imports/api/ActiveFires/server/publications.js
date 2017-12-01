import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import ActiveFires from '../ActiveFires';

Meteor.publish('activefires', function activefires() {
  return ActiveFires.find();
});

const validZoom = Match.Where((zoom) => {
  // http://wiki.openstreetmap.org/wiki/Zoom_levels
  check(zoom, Number);
  return zoom >= 0 && zoom <= 19;
});

// https://github.com/3stack-software/meteor-match-library
var NumberBetween = function (min, max) {
  return Match.Where(function (x) {
    check(x, Number);
    return min <= x && x <= max;
  });
};

var NullOr = function (type) {
  return Match.Where(function (x) {
    if (x === null) {
      return true;
    }
    check(x, type);
    return true;
  });
};


const zoomMetersPerPixel = [156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298];

var activefires = function(zoom, lat, lng) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(lat, NumberBetween(-90, 90));
  check(lng, NumberBetween(-180, 180));

  // console.log("Zoom: " + zoom + " lat: " + lat + " lng: " + lng);
  // console.log("Meters per pixel: " + zoomMetersPerPixel[zoom]);

  // console.log(geoData);
  return ActiveFires.find({
    ourid: {
      $near : {
        $geometry: {
          type: "Point",
          coordinates: [ lng, lat]
        },
        $minDistance: 0,
        $maxDistance: zoomMetersPerPixel[zoom] * 1000
      }
    }
  });
}

Meteor.publish('activefiresmyloc', function(zoom, lat, lng) {
  check(zoom, validZoom);
  check(lat, NullOr(Number));
  check(lng, NullOr(Number));
  if (lat === null || lng === null) {
    var clientIP = this.connection.clientAddress;
    if (clientIP === '127.0.0.1') {
      clientIP = '80.58.61.250' // Some Spain IP address
    }
    var geoData = IPGeocoder.geocode(clientIP);
    var location = geoData.location;
    lat = location.latitude;
    lng = location.longitude;
  }
  return activefires(zoom, lat, lng);
});
