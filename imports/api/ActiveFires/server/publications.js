import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import ActiveFires from '../ActiveFires';

var counter = new Counter('countActiveFires', ActiveFires.find({}));

Meteor.publish('activefirestotal', function() {
  return counter;
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

// http://wiki.openstreetmap.org/wiki/Zoom_levels
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale
const zoomMetersPerPixel = [156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298];

// http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

var activefires = function(zoom, lat, lng, height, width) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(lat, NumberBetween(-90, 90));
  check(lng, NumberBetween(-180, 180));

  // console.log("Zoom: " + zoom + " lat: " + lat + " lng: " + lng);
  var resolution = 156543.03 * Math.cos(Math.radians(lat)) / Math.pow(2,zoom);
  // console.log(`Meters per pixel ${zoomMetersPerPixel[zoom]}, resolution ${resolution} meters x pixel`);
  var distance = Math.trunc(Math.max(resolution*height, resolution*width));
  // console.log(`so ${height}x${width} gives ${Math.trunc(resolution*height/1000)} x ${Math.trunc(resolution*width/1000)} km, so looking in ${distance}`);

  // console.log(geoData);
  return ActiveFires.find({
    ourid: {
      $near : {
        $geometry: {
          type: "Point",
          coordinates: [ lng, lat]
        },
        $minDistance: 0,
        $maxDistance: distance
      }
    }
  });
}

Meteor.publish('activefiresmyloc', function(zoom, lat, lng, height, width) {
  check(zoom, validZoom);
  check(lat, NullOr(Number));
  check(lng, NullOr(Number));
  check(height, NullOr(Number));
  check(width, NullOr(Number));
  console.log(`Check active fires in ${lat},${lng} with zoom ${zoom} pixels in ${height}x${width} map`)
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
  return activefires(zoom, lat, lng, height, width);
});
