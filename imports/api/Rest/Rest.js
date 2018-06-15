/* global Restivus */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { NumberBetween } from '/imports/modules/server/other-checks';
import Fires from '/imports/api/Fires/Fires';
import { check } from 'meteor/check';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import { countRealFires } from '/imports/api/ActiveFires/server/countFires';
import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import Subscriptions from '/imports/api/Subscriptions/Subscriptions';
import jsend from 'jsend';
import { Random } from 'meteor/random';
import { subscriptionsInsert } from '/imports/api/Subscriptions/methods.js';

const debug = false;

const uptime = new Date();

const restivusError = (code, message) => ({ status: 'error', statusCode: code, body: message });

function fail(e) {
  return restivusError(500, `Unexpected error in REST call: ${e}`);
}

function defaultFailParams(e) {
  return restivusError(400, `Wrong REST params: ${e}`);
}

function checkAuthToken(token) {
  if (!Meteor.settings.private.internalApiToken || token !== Meteor.settings.private.internalApiToken) {
    const message = 'Unauthorized auth token in REST API';
    console.warn(message);
    return restivusError(401, message);
  }
  return undefined;
}

function checkLatLonDist(km, lat, lng) {
  check(lng, NumberBetween(-180, 180));
  check(lat, NumberBetween(-90, 90));
  check(km, NumberBetween(0, Meteor.isDevelopment ? 1000 : 100));
}

if (!Meteor.settings.private.internalApiToken) {
  console.warn('Meteor.settings.private.internalApiToken is not configured so we don\'t enable our REST API');
} else {
// export
  const apiV1 = new Restivus({
    useDefaultAuth: true,
    apiPath: 'api',
    version: 'v1',
    prettyJson: true
  });

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
  /* apiV1.addCollection(Meteor.users, {
 *   excludedEndpoints: ['getAll', 'put', 'delete', 'patch', 'get'],
 *   routeOptions: {
 *     authRequired: true
 *   },
 *   endpoints: {
 *     post: {
 *       authRequired: false
 *     },
 *     delete: {
 *       roleRequired: 'admin'
 *     }
 *   }
 * }); */

  apiV1.addCollection(Fires, {
    excludedEndpoints: ['put', 'post', 'patch', 'delete'],
    // excludedEndpoints: ['getAll', 'put', 'post', 'patch', 'delete'],
    routeOptions: {
      authRequired: false
    },
    endpoints: {
      get: {
        action: function getFire() {
          return Fires.findOne(new Meteor.Collection.ObjectID(this.urlParams.id));
        }
      }
    }
  });

  // Maps to: /api/v1/status/last-fire-check
  apiV1.addRoute('status/last-fire-check', { authRequired: false }, {
    get: function get() {
      return SiteSettings.findOne({ name: 'last-fire-check' });
    }
  });

  // Maps to: /api/v1/status/last-fire-detected
  apiV1.addRoute('status/last-fire-detected', { authRequired: false }, {
    get: function get() {
      return ActiveFiresCollection.findOne({}, { sort: { when: -1 } });
    }
  });

  // Maps to: /api/v1/status/active-fires-count
  apiV1.addRoute('status/active-fires-count', { authRequired: false }, {
    get: function get() {
      return { total: ActiveFiresCollection.find({}).count() };
    }
  });

  // Maps to: /api/v1/status/uptime
  apiV1.addRoute('status/uptime', { authRequired: false }, {
    get: function get() {
      return { ms: new Date() - uptime };
    }
  });

  function getFires(route, full) {
    const lat = Number(route.urlParams.lat);
    const lng = Number(route.urlParams.lng);
    const km = Number(route.urlParams.km);
    const { token } = route.urlParams;
    try {
      checkLatLonDist(km, lat, lng);
      check(token, String);
    } catch (e) {
      return defaultFailParams(e);
    }

    const failed = checkAuthToken(token);
    if (failed) return failed;

    if (debug) console.log(`Query for fires in ${lat}, ${lng} in ${km} km radius`);

    const fires = ActiveFiresCollection.find({
      ourid: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: km * 1000,
          $minDistance: 0
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

    const result = { total: fires.count(), real: countRealFires(fires) };

    if (!full) {
      return result;
    }

    // TODO only get real
    const firesA = fires.fetch();
    if (firesA.length > 0) {
      const union = firesUnion(fires);
      const falsePos = whichAreFalsePositives(FalsePositives, union);
      const industries = whichAreFalsePositives(Industries, union);
      result.fires = firesA;
      result.industries = industries.fetch();
      result.falsePos = falsePos.fetch();
      return result;
    }

    // otherwise
    return {
      total: 0, real: 0, fires: [], falsePos: [], industries: []
    };
  }

  // Maps to: /api/v1/fires-in/:lat/:lng/:km
  // 100 km max
  // Ex: http://127.0.0.1:3000/api/v1/fires-in/token/38.736946/-9.142685/100
  apiV1.addRoute('fires-in/:token/:lat/:lng/:km', { authRequired: false }, {
    get: function get() {
      return getFires(this, false);
    }
  });

  apiV1.addRoute('fires-in-full/:token/:lat/:lng/:km', { authRequired: false }, {
    get: function get() {
      return getFires(this, true);
    }
  });

  // Add mobile user:
  // curl -X POST http://localhost:3000/api/v1/users/mobile -d "token: thisAppAutToken" -d "mobileToken: user-mobile-firebase-token"
  // Response:
  //
  // https://docs.meteor.com/api/passwords.html#Accounts-createUser
  apiV1.addRoute('mobile/users', { authRequired: false }, {
    post: function post() {
      const { token, mobileToken, lang } = this.bodyParams;
      try {
        check(token, String);
        check(lang, String);
        check(mobileToken, String);
      } catch (e) {
        return defaultFailParams(e);
      }

      const failed = checkAuthToken(token);
      if (failed) return failed;

      let username;

      const already = Meteor.users.find({ fireBaseToken: mobileToken });

      if (already.count() > 1) {
        return restivusError(500, 'Unexpected error in REST call: several users with that mobile token?');
      } else if (already.count() === 1) {
        username = already.fetch()[0].username;
      } else {
        do {
          username = Random.id(15);
        } while (Meteor.users.find({ username }).count() !== 0);
      }

      // FIXME check valid lang

      const now = new Date();

      const result = Meteor.users.upsert({
        fireBaseToken: mobileToken
      }, {
        $set: {
          username,
          fireBaseToken: mobileToken,
          lang,
          profile: { },
          createdAt: now,
          updatedAt: now
        }
      });


      if (debug) {
        console.log(this.bodyParams);
        console.log(this.urlParams);
        console.log(this.queryParams);
      }

      const upsertUser = Meteor.users.findOne({ username });

      if (debug) console.log(upsertUser);

      return jsend.success({
        upsertResult: result,
        username,
        userId: upsertUser._id,
        lang: upsertUser.lang,
        mobileToken: upsertUser.fireBaseToken
      });
    }

  });

  // max sitance: 100km
  apiV1.addRoute('mobile/subscriptions', { authRequired: false }, {
    post: function post() {
      const {
        token,
        mobileToken,
        lat,
        lon,
        distance
      } = this.bodyParams;
      try {
        check(token, String);
        check(mobileToken, String);
        check(lat, Number);
        check(lon, Number);
        check(distance, Number);
        checkLatLonDist(distance, lat, lon);
      } catch (e) {
        return defaultFailParams(e);
      }

      const failed = checkAuthToken(token);
      if (failed) return failed;

      const user = Meteor.users.findOne({ fireBaseToken: mobileToken });
      if (!user) return failed;

      const newSubs = {};
      newSubs.location = {};
      newSubs.location.lat = lat;
      newSubs.location.lon = lon;
      newSubs.distance = distance;

      let result;
      try {
        result = subscriptionsInsert(newSubs, user._id, 'mobile');
      } catch (e) {
        return fail(e);
      }
      return jsend.success({ subsId: result._str });
    },
    delete: function del() {
      const {
        token,
        mobileToken,
        subsId
      } = this.bodyParams;
      try {
        check(token, String);
        check(mobileToken, String);
        check(subsId, String);
      } catch (e) {
        return defaultFailParams(e);
      }

      const failed = checkAuthToken(token);
      if (failed) return failed;

      const user = Meteor.users.findOne({ fireBaseToken: mobileToken });
      if (!user) return failed;

      try {
        Subscriptions.remove({ owner: user._id, _id: new Meteor.Collection.ObjectID(subsId) });
      } catch (e) {
        return fail(e);
      }

      return jsend.success({});
    }
  });

  apiV1.addRoute('mobile/subscriptions/all', { authRequired: false }, {
    get: function get() {
      const { token, mobileToken } = this.bodyParams;
      try {
        check(token, String);
        check(mobileToken, String);
      } catch (e) {
        return defaultFailParams(e);
      }

      const failed = checkAuthToken(token);
      if (failed) return failed;

      const user = Meteor.users.findOne({ fireBaseToken: mobileToken });
      if (!user) return failed;

      const result = Subscriptions.find({ owner: user._id });

      return jsend.success({ subscriptions: result.fetch(), count: result.count() });
    },
    delete: function delAll() {
      const { token, mobileToken } = this.bodyParams;
      try {
        check(token, String);
        check(mobileToken, String);
      } catch (e) {
        return defaultFailParams(e);
      }

      const failed = checkAuthToken(token);
      if (failed) return failed;

      if (Meteor.users.find({ fireBaseToken: mobileToken }).count() !== 1) return failed;

      const user = Meteor.users.findOne({ fireBaseToken: mobileToken });
      if (!user) return failed;
      const toRemove = Subscriptions.find({ owner: user._id }).count();
      Subscriptions.remove({ owner: user._id });

      return jsend.success({ count: toRemove });
    }
  });
}
