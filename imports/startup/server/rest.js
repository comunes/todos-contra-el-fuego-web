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

Meteor.startup(() => {
  const uptime = new Date();

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

  // Maps to: /api/v1/status/last-fires-count
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
    check(lng, NumberBetween(-180, 180));
    check(lat, NumberBetween(-90, 90));
    check(km, NumberBetween(0, Meteor.isDevelopment ? 1000 : 100));
    check(token, String);

    if (token !== Meteor.settings.private.internalApiToken) {
      console.warn(`WARNING: Query for fires in ${lat}, ${lng} in ${km} km radius with wrong token`);
      return { error: 'Unauthorized' };
    }

    console.log(`Query for fires in ${lat}, ${lng} in ${km} km radius`);

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

    if (!full) {
      return { total: fires.count(), real: countRealFires(fires) };
    }

    // TODO only get real
    const firesA = fires.fetch();
    if (firesA.length > 0) {
      const union = firesUnion(fires);
      const falsePos = whichAreFalsePositives(FalsePositives, union);
      const industries = whichAreFalsePositives(Industries, union);
      return { fires: firesA, falsePos: falsePos.fetch(), industries: industries.fetch() };
    }
    return { fires: [] };
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
});
