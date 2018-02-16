/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import L from 'leaflet-headless';
import { NumberBetween } from '/imports/modules/server/other-checks';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';
import ActiveFires from '../ActiveFires';

const counter = new Counter('countActiveFires', ActiveFires.find({}));

Meteor.publish('activefirestotal', function total() {
  return counter;
});

const falsePositives = (fires) => {
  const falsePos = FalsePositives.find({
    geo: {
      $geoWithin: {
        $geometry: fires.geometry
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

  /* console.log(`False positive total: ${falsePos.count()}`);
   * console.log(`False positives: ${JSON.stringify(falsePos.fetch())}`); */
  return falsePos;
};

const activefires = (northEastLng, northEastLat, southWestLng, southWestLat) => {
  const fires = ActiveFires.find({
    ourid: {
      $geoWithin: {
        $box: [
          [southWestLng, southWestLat],
          [northEastLng, northEastLat]
        ]
      }
    }
  }, {
    fields: {
      lat: 1,
      lon: 1,
      when: 1,
      scan: 1
    }
  });

  const group = new L.FeatureGroup();
  const remap = fires.fetch().map(function remap(doc) {
    return { location: { lat: doc.lat, lon: doc.lon }, distance: doc.scan };
  });
  const result = calcUnion(remap, group, sub => sub);
  const falsePos = falsePositives(result[0]);
  // console.log(JSON.stringify(result));
  // console.log(`Fires total: ${fires.count()}`);
  return [fires, falsePos];
};

Meteor.publish('activefiresmyloc', function activeInMyLoc(northEastLng, northEastLat, southWestLng, southWestLat) {
  // latitude -90 and 90 and the longitude between -180 and 180
  check(northEastLng, NumberBetween(-180, 180));
  check(southWestLat, NumberBetween(-90, 90));
  check(southWestLng, NumberBetween(-180, 180));
  check(northEastLat, NumberBetween(-90, 90));

  return activefires(northEastLng, northEastLat, southWestLng, southWestLat);
});
