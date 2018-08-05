/* eslint-disable import/no-absolute-path */
/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import urlEnc from '/imports/modules/url-encode';
import { Promise } from 'meteor/promise';
import NodeGeocoder from 'node-geocoder';
import { gmapServerKey } from '/imports/startup/server/IPGeocoder';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import ravenLogger from '/imports/startup/server/ravenLogger';

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

const unseal = async (obj) => {
  try {
    const unsealed = await urlEnc.decrypt(obj);
    return unsealed;
  } catch (error) {
    // console.warn(error);
    return undefined;
  }
};

const unsealW = obj => unseal(obj);

const fixConfidence = (obj) => {
  if (typeof obj.confidence === 'string') {
    obj.confidence = Number.parseInt(obj.confidence, 10);
  }
  if (typeof obj.confidence === 'undefined' || isNaN(obj.confidence)) {
    delete obj.confidence;
  }
  return obj;
};

const findOrCreateFire = (obj) => {
  const fire = findFire(obj);
  // console.log(`Found: ${fire.count()}`);
  if (!obj.address) {
    try {
      const rev = Promise.await(geocoder.reverse({ lat: obj.lat, lon: obj.lon }));
      if (rev[0]) {
        obj.address = rev[0].formattedAddress;
      }
      // console.log(obj.address);
    } catch (reve) {
      console.warn(reve);
    }
  }
  if (fire.count() === 0) {
    // const result =
    // console.log('Creating new fire');
    FiresCollection.upsert({ ourid: obj.ourid, when: obj.when, type: obj.type }, { $set: obj }, { multi: false, upsert: true });
    // console.log(JSON.stringify(result));
  }
  return findFire(obj);
};

Meteor.publish('fireFromAlertId', function fireFromAlertId(_id) {
  try {
    check(_id, String);
    // console.log(`Looking for alert fire ${_id}`);
    const fire = FireAlertsCollection.findOne(new Meteor.Collection.ObjectID(_id));
    if (fire) {
      // console.info(`Active fire found: ${_id}`);
      return findOrCreateFire(fixConfidence(fire));
    }
    console.info(`Alert fire not found: ${_id}`);
    // Not found in active fires!
    return this.ready();
  } catch (e) {
    console.info(`Alert fire not found (with error): ${_id}`);
    return this.ready();
  }
});

Meteor.publish('fireFromActiveId', function fireFromActiveId(_id) {
  try {
    check(_id, String);
    // console.log(`Looking for active fire ${_id}`);
    const fire = ActiveFiresCollection.findOne(new Meteor.Collection.ObjectID(_id));
    if (fire) {
      // console.info(`Active fire found: ${_id}`);
      return findOrCreateFire(fixConfidence(fire));
    }
    console.info(`Active fire not found: ${_id}`);
    // Not found in active fires!
    return this.ready();
  } catch (e) {
    console.info(`Active fire not found (with error): ${_id}`);
    return this.ready();
  }
});

Meteor.publish('fireFromId', function fireFromId(_id) {
  try {
    check(_id, String);
    // console.log(`Looking for archive fire ${_id}`);
    const fire = FiresCollection.find(new Meteor.Collection.ObjectID(_id));
    if (fire.count() !== 0) {
      // console.info(`Archive fire found: ${_id}`);
      const union = firesUnion(fire);
      const falsePos = whichAreFalsePositives(FalsePositives, union);
      const industries = whichAreFalsePositives(Industries, union);
      return [fire, falsePos, industries];
    }
    console.info(`Fire not found: ${_id}`);
    // Not found in active fires!
    return this.ready();
  } catch (e) {
    console.info(`Archive fire not found (with error): ${_id}`);
    return this.ready();
  }
});

function logUrl(fireEnc, params) {
  const message = `Wrong fire: ${fireEnc}. Params received in url: ${JSON.stringify(params)}`;
  console.log(message);
  ravenLogger.log(message);
}

export function fireFromHash(fireEnc, params) {
  check(fireEnc, String);
  check(params, Object);
  try {
    // console.log(fireEnc);
    // const unsealed = Promise.await(urlEnc.decrypt(fireEnc));
    const unsealed = Promise.await(unsealW(fireEnc));
    if (unsealed === undefined) {
      logUrl(fireEnc, params);
      // https://guide.meteor.com/data-loading.html
      return this.ready();
    }
    const w = unsealed.when;
    unsealed.when = new Date(w);
    const c = unsealed.createdAt;
    unsealed.createdAt = !c ? new Date() : new Date(c);
    const u = unsealed.updatedAt;
    unsealed.updatedAt = !u ? new Date() : new Date(u);
    // console.log(unsealed);
    // FIXME:
    const unsealedFix = fixConfidence(unsealed);
    FiresCollection.schema.validate(unsealedFix);
    return findOrCreateFire(unsealedFix);
    /* console.log(`fires: ${fire.count()}`);
     * return fire; */
  } catch (e) {
    console.warn(e);
    logUrl(fireEnc, params);

    return this.ready();
  }
}

Meteor.publish('fireFromHash', function fireFromHashFunc(fireEnc, params) {
  check(fireEnc, String);
  check(params, Object);
  return fireFromHash(fireEnc, params).bind(this);
});
