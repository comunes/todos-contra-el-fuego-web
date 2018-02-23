/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NumberBetween } from '/imports/modules/server/other-checks';
import L from 'leaflet-headless';
import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';
import FalsePositives from '../FalsePositives';

const counter = new Counter('countFalsePositives', FalsePositives.find({}));

Meteor.publish('falsePositivesTotal', function total() {
  return counter;
});

export const whichAreFalsePositives = (fires) => {
  const group = new L.FeatureGroup();
  const remap = fires.fetch().map(function remap(doc) {
    // default scan: 1 for neightbor alerts
    return { location: { lat: doc.lat, lon: doc.lon }, distance: doc.scan || 1 };
  });
  const result = calcUnion(remap, group, sub => sub);

  const falsePos = FalsePositives.find({
    geo: {
      $geoWithin: {
        $geometry: result[0].geometry
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
  return falsePos;
};

const falsePositives = (northEastLng, northEastLat, southWestLng, southWestLat) => {
  const fires = FalsePositives.find({
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
  }).serverTransform(function transformDoc(odoc) {
    const doc = odoc;
    // Destructuring gives me an error: "Cannot destructure property `geo` of 'undefined'"
    const geo = doc.geo;
    if (geo) {
      doc.lat = geo.coordinates[1];
      doc.lon = geo.coordinates[0];
    }
    doc._id = doc.fireId;
    doc.id = doc.fireId;
    delete doc.geo;
    // console.log(doc);
    return doc;
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

  return falsePositives(northEastLng, northEastLat, southWestLng, southWestLat);
});
