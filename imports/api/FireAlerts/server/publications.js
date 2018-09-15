/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NumberBetween } from '/imports/modules/server/other-checks';
import FireAlerts from '../FireAlerts';

Meteor.publish('fireAlerts', function fireAlerts(northEastLng, northEastLat, southWestLng, southWestLat) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(northEastLng, NumberBetween(-180, 180));
  check(southWestLat, NumberBetween(-90, 90));
  check(southWestLng, NumberBetween(-180, 180));
  check(northEastLat, NumberBetween(-90, 90));

  // https://stackoverflow.com/questions/29327222/mongodb-find-created-results-by-date-today/29327353
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const fires = FireAlerts.find({
    ourid: {
      $geoWithin: {
        $box: [
          [southWestLng, southWestLat],
          [northEastLng, northEastLat]
        ]
      }
    },
    createdAt: { $gte: start, $lt: end }
  }, {
    fields: {
      lat: 1,
      lon: 1,
      scan: 1,
      track: 1
    }
  });
  if (Meteor.isDevelopment) console.log(`Neighbour alerts total: ${fires.count()}`);
  return fires;
});
