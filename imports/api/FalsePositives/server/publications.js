/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NumberBetween } from '/imports/modules/server/other-checks';
import L from 'leaflet-headless';
import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';
import Industries from '/imports/api/Industries/Industries';
import FalsePositives from '../FalsePositives';

const counter = new Counter('countFalsePositives', FalsePositives.find({}));

Meteor.publish('falsePositivesTotal', function total() {
  return counter;
});

export const firesUnion = (fires) => {
  const group = new L.FeatureGroup();
  const firesArray = Array.isArray(fires) ? fires : fires.fetch(); // if not is a cursor
  const remap = firesArray.map(function remap(doc) {
    // default scan: 1 for neightbor alerts
    return { location: { lat: doc.lat, lon: doc.lon }, distance: doc.scan || 1 };
  });
  const union = calcUnion(remap, group, sub => sub);
  return union;
};

export const zoneToUnion = (lat, lon, distance) => {
  const group = new L.FeatureGroup();
  const remap = [{ location: { lat, lon }, distance }];
  const union = calcUnion(remap, group, sub => sub);
  return union;
};

export const whichAreFalsePositives = (collection, union) => {
  const result = collection.find({
    geo: {
      $geoWithin: {
        $geometry: union[0].geometry
      }
    }
  }, {
    fields: {
      geo: 1,
      // type: 1,
      // when: 1,
      fireId: 1
    }
  });

  /*  console.log(`False positive total: ${falsePos.count()}`);
     console.log(`False positives: ${JSON.stringify(falsePos.fetch())}`); */
  return result;
};

const find = (collection, northEastLng, northEastLat, southWestLng, southWestLat) => {
  const fires = collection.find({
    geo: {
      $geoWithin: {
        $box: [
          [southWestLng, southWestLat],
          [northEastLng, northEastLat]
        ]
      }
    }
  }, {
    fields: {
      geo: 1,
      // type: 1,
      // when: 1,
      fireId: 1
    }
  });
  // console.log(`Fires total: ${fires.count()}`);
  return fires;
};

Meteor.publishTransformed('falsePositivesMyloc', function falsePositivesInMyLoc(northEastLng, northEastLat, southWestLng, southWestLat) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(northEastLng, NumberBetween(-180, 180));
  check(southWestLat, NumberBetween(-90, 90));
  check(southWestLng, NumberBetween(-180, 180));
  check(northEastLat, NumberBetween(-90, 90));

  return find(FalsePositives, northEastLng, northEastLat, southWestLng, southWestLat);
});

Meteor.publishTransformed('industriesMyloc', function industriesInMyLoc(northEastLng, northEastLat, southWestLng, southWestLat) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(northEastLng, NumberBetween(-180, 180));
  check(southWestLat, NumberBetween(-90, 90));
  check(southWestLng, NumberBetween(-180, 180));
  check(northEastLat, NumberBetween(-90, 90));

  return find(Industries, northEastLng, northEastLat, southWestLng, southWestLat);
});
