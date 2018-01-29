/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import urlEnc from '/imports/modules/url-encode';
import { Promise } from 'meteor/promise';
import NodeGeocoder from 'node-geocoder';
import { gmapServerKey } from '/imports/startup/server/IPGeocoder';
import FiresCollection from '../Fires';

function findFire(unsealed) {
  const fire = FiresCollection.find({ ourid: { type: 'Point', coordinates: [unsealed.lon, unsealed.lat] }, when: unsealed.when, type: unsealed.type });
  return fire;
}

const options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: gmapServerKey, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

Meteor.publish('fireFromHash', function fireFromHash(fireEnc) {
  check(fireEnc, String);
  try {
    // console.log(fireEnc);
    const unsealed = Promise.await(urlEnc.decrypt(fireEnc));
    const w = unsealed.when;
    unsealed.when = new Date(w);
    const c = unsealed.createdAt;
    unsealed.createdAt = !c ? new Date() : new Date(c);
    const u = unsealed.updatedAt;
    unsealed.updatedAt = !u ? new Date() : new Date(u);
    // console.log(unsealed);
    FiresCollection.schema.validate(unsealed);
    const fire = findFire(unsealed);
    // console.log(`Found: ${fire.count()}`);
    if (!unsealed.address) {
      try {
        const rev = Promise.await(geocoder.reverse({ lat: unsealed.lat, lon: unsealed.lon }));
        if (rev[0]) {
          unsealed.address = rev[0].formattedAddress;
        }
        // console.log(unsealed.address);
      } catch (reve) {
        console.error(reve);
      }
    }
    if (fire.count() === 0) {
      // const result =
      FiresCollection.upsert({ ourid: unsealed.ourid, when: unsealed.when, type: unsealed.type }, { $set: unsealed }, { multi: false, upsert: true });
      // console.log(JSON.stringify(result));
    }
    return findFire(unsealed);
    /* console.log(`fires: ${fire.count()}`);
     * return fire; */
  } catch (e) {
    console.error(e);
    throw new Meteor.Error('500', e);
  }
});
