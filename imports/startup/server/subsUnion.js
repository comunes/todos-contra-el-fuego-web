/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import Subscriptions from '/imports/api/Subscriptions/Subscriptions';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import Perlin from 'loms.perlin';
import L from 'leaflet-headless';
import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';

// sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev

Meteor.startup(() => {
  const debug = true; // Meteor.isDevelopment;
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

  const process = (isPublic) => {
    const group = new L.FeatureGroup();
    const result = calcUnion(Subscriptions.find().fetch(), group, isPublic ? addNoisy : sub => sub);
    const union = result[0];
    const bounds = result[1];

    const publicl = isPublic ? 'public' : 'private';
    const Publicl = publicl.replace(/\b\w/g, l => l.toUpperCase());

    if (typeof union === 'object') {
      const unionSet = {
        $set: {
          name: `subs-${publicl}-union`,
          value: JSON.stringify(union),
          isPublic,
          description: `${Publicl} subscriptions union`,
          type: 'string'
        }
      };
      const boundsSet = {
        $set: {
          name: `subs-${publicl}-union-bounds`,
          value: JSON.stringify(bounds),
          isPublic,
          description: `${Publicl} subscriptions union bounds`,
          type: 'string'
        }
      };
      // FIXME, take care of object size:
      // https://stackoverflow.com/questions/10827812/what-is-the-length-maximum-for-a-string-data-type-in-mongodb-used-with-ruby
      SiteSettings.upsert({ name: `subs-${publicl}-union` }, unionSet, { multi: false });
      SiteSettings.upsert({ name: `subs-${publicl}-union-bounds` }, boundsSet, { multi: false });
      if (debug) console.log(`${Publicl} subscription union calculated`);
    } else {
      console.log('Subscription union failed!');
    }
  };

  // At startup
  process(true);
  process(false);

  Subscriptions.find({ createdAt: { $gt: new Date() } }).observe({
    added: function newSubAdded() { // doc) {
      if (debug) console.log('Subs added so recreate union');
      process(true);
      process(false);
    }
  });

  Subscriptions.find().observe({
    changed: function subsChanged() { // updatedDoc, oldDoc) {
      if (debug) console.log('Subs changed so recreate union');
      process(true);
      process(false);
    },
    removed: function subsRemoved() { // oldDoc) {
      if (debug) console.log('Subs removed so recreate union');
      process(true);
      process(false);
    }
  });
});
