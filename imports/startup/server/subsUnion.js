/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import Subscriptions from '/imports/api/Subscriptions/Subscriptions';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import Perlin from 'loms.perlin';
import L from 'leaflet-headless';
import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';

// sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev

Meteor.startup(() => {
  Perlin.seed(Math.random());

  const addNoisy = (osub) => {
    const sub = osub;
    let lat = Math.round(sub.location.lat * 10) / 10;
    let lon = Math.round(sub.location.lon * 10) / 10;
    const noiseBase = Perlin.perlin2(lat, lon);
    const noise = Math.abs(noiseBase / 3);
    lat += noise;
    lon += noise;
    sub.location.lat = lat;
    sub.location.lon = lon;
    sub.distance += noiseBase;
    return sub;
  };

  const process = () => {
    const group = new L.FeatureGroup();
    const result = calcUnion(Subscriptions.find().fetch(), group, addNoisy);
    const union = result[0];
    const bounds = result[1];

    if (typeof union === 'object') {
      const unionSet = {
        $set: {
          name: 'subs-public-union',
          value: JSON.stringify(union),
          isPublic: true,
          description: 'Public subscriptions union',
          type: 'string'
        }
      };
      const boundsSet = {
        $set: {
          name: 'subs-public-union-bounds',
          value: JSON.stringify(bounds),
          isPublic: true,
          description: 'Public subscriptions union bounds',
          type: 'string'
        }
      };
      // FIXME, take care of object size:
      // https://stackoverflow.com/questions/10827812/what-is-the-length-maximum-for-a-string-data-type-in-mongodb-used-with-ruby
      SiteSettings.upsert({ name: 'subs-public-union' }, unionSet, { multi: false });
      SiteSettings.upsert({ name: 'subs-public-union-bounds' }, boundsSet, { multi: false });
      if (Meteor.isDevelopment) console.log('Subscription union calculated');
    } else {
      console.log('Subscription union failed!');
    }
  };

  // At startup
  process();

  Subscriptions.find({ createdAt: { $gt: new Date() } }).observe({
    added: function newSubAdded() { // doc) {
      if (Meteor.isDevelopment) console.log('Subs added so recreate union');
      process();
    }
  });

  Subscriptions.find().observe({
    changed: function subsChanged() { // updatedDoc, oldDoc) {
      if (Meteor.isDevelopment) console.log('Subs changed so recreate union');
      process();
    },
    removed: function subsRemoved() { // oldDoc) {
      if (Meteor.isDevelopment) console.log('Subs removed so recreate union');
      process();
    }
  });
});
