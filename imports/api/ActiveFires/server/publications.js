/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { localize } from '/imports/startup/server/IPGeocoder';
import ActiveFires from '../ActiveFires';

const counter = new Counter('countActiveFires', ActiveFires.find({}));

Meteor.publish('activefirestotal', function total() {
  return counter;
});

const validZoom = Match.Where((zoom) => {
  // http://wiki.openstreetmap.org/wiki/Zoom_levels
  check(zoom, Number);
  return zoom >= 0 && zoom <= 19;
});

// https://github.com/3stack-software/meteor-match-library
function NumberBetween(min, max) {
  return Match.Where((x) => {
    check(x, Number);
    return min <= x && x <= max;
  });
}

function NullOr(type) {
  return Match.Where((x) => {
    if (x === null) {
      return true;
    }
    check(x, type);
    return true;
  });
}

// http://wiki.openstreetmap.org/wiki/Zoom_levels
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale

// http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/
Math.radians = (degrees) => {
  const rad = (degrees * Math.PI) / 180;
  return rad;
};

const activefires = (zoom, lat, lng, height, width) => {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(lat, NumberBetween(-90, 90));
  check(lng, NumberBetween(-180, 180));

  // console.log("Zoom: " + zoom + " lat: " + lat + " lng: " + lng);
  const resolution = (156543.03 * Math.cos(Math.radians(lat))) / (2 ** zoom);
  const distUnt = resolution * Math.max(height, width);
  const distance = Math.trunc(distUnt);
  // console.log(`so ${height}x${width} gives ${Math.trunc(resolution*height/1000)} x ${Math.trunc(resolution*width/1000)} km, so looking in ${distance}`);
  // console.log(`So ${height}x${width} gives ${Math.trunc(resolution)} of resolution, so looking in ${Math.trunc(distance / 1000)}km`);

  const fires = ActiveFires.find({
    ourid: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $minDistance: 0,
        $maxDistance: distance
      }
    }
  }, {
    fields: {
      lat: 1,
      lon: 1,
      scan: 1
    }
  });
  // console.log(`Fires total: ${fires.count()}`);
  return fires;
};


Meteor.publish('allActiveFires', function allActive() {
  // latitude -90 and 90 and the longitude between -180 and 180

  const { latitude, longitude } = localize().location;
  // console.log(`${latitude}, ${longitude}`);
  check(latitude, NumberBetween(-90, 90));
  check(longitude, NumberBetween(-180, 180));
  // https://docs.meteor.com/api/collections.html#Mongo-Collection-find
  return ActiveFires.find({
    ourid: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $minDistance: 0,
        $maxDistance: 1000 // 156412000
      }
    }
  }, {
    fields: {
      _id: 0,
      lat: 1,
      lon: 1,
      scan: 1
    },
    maxTimeMs: 30000
  });
});

Meteor.publish('activefiresmyloc', function activeInMyLoc(zoom, lat, lng, height, width) {
  check(zoom, validZoom);
  check(lat, NullOr(Number));
  check(lng, NullOr(Number));
  check(height, NullOr(Number));
  check(width, NullOr(Number));
  // console.log(`Check active fires in ${lat},${lng} with zoom ${zoom} pixels in ${height}x${width} map`);
  if (lat && lng) {
    return activefires(zoom, lat, lng, height, width);
  }
  const location = localize();
  // console.log(`${location.latitude}, ${location.longitude}`);
  return activefires(zoom, location.latitude, location.longitude, height, width);
});
