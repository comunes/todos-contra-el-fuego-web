/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NumberBetween } from '/imports/modules/server/other-checks';
// import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
// import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
// import Industries from '/imports/api/Industries/Industries';
import ActiveFiresUnion from '../ActiveFiresUnion';

const counter = new Counter('countActiveFiresUnion', ActiveFiresUnion.find({}));

Meteor.publish('activefiresuniontotal', function total() {
  return counter;
});

const activeFiresUnion = (b1, b2, c1, c2, withMarks) => {
  // a --- b
  // c --- d
  const geometry = {
    $geometry: {
      type: 'Polygon',
      coordinates: [[
        [c1, c2],
        [c1, b2],
        [b1, b2],
        [b1, c2],
        [c1, c2]
      ]]
    }
  };
  // console.log(JSON.stringify(geometry));
  const fires = ActiveFiresUnion.find({
    shape: {
      $geoIntersects: geometry
    }
  }, {
    fields: {
      shape: 1,
      centerid: 1,
      when: 1,
      createdAt: 1,
      updatedAt: 1
    }
  });

  if (Meteor.isDevelopment) console.log(`Active fires union total: ${fires.count()}`);

  /*
  if (withMarks && fires.fetch().length > 0) {
    const union = firesUnion(fires);
    const falsePos = whichAreFalsePositives(FalsePositives, union);
    const industries = whichAreFalsePositives(Industries, union);
    return [fires, falsePos, industries];
  } */

  return fires;
};

Meteor.publish('activefiresunionmyloc', function activeInMyLoc(northEastLng, northEastLat, southWestLng, southWestLat, withMarks) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(northEastLng, NumberBetween(-180, 180));
  check(southWestLat, NumberBetween(-90, 90));
  check(southWestLng, NumberBetween(-180, 180));
  check(northEastLat, NumberBetween(-90, 90));
  check(withMarks, Boolean);

  // I use this for fire stats
  // if (!Meteor.isDevelopment) return this.ready(); // empty
  return activeFiresUnion(northEastLng, northEastLat, southWestLng, southWestLat, withMarks);
});

// Warning: this increase always by one the fire stats
Meteor.publish('lastFireUnionDetected', function lastFireDetected() {
  // I use this for fire stats
  // if (!Meteor.isDevelopment) return this.ready(); // empty
  return ActiveFiresUnion.find({}, { limit: 1, sort: { when: -1 } });
});
