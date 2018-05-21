/* global Restivus */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { NumberBetween } from '/imports/modules/server/other-checks';
import Fires from '/imports/api/Fires/Fires';
import { check } from 'meteor/check';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import { countRealFires } from '/imports/api/ActiveFires/server/countFires';

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

  // Maps to: /api/v1/status/last-fire-detected
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

  // Maps to: /api/v1/fires-in/:lat/:lng/:km
  // Ex: http://127.0.0.1:3000/api/v1/fires-in/38.736946/-9.142685/100
  apiV1.addRoute('fires-in/:token/:lat/:lng/:km', { authRequired: false }, {
    get: function get() {
      const lat = Number(this.urlParams.lat);
      const lng = Number(this.urlParams.lng);
      const km = Number(this.urlParams.km);
      const { token } = this.urlParams;
      check(lng, NumberBetween(-180, 180));
      check(lat, NumberBetween(-90, 90));
      check(km, NumberBetween(0, 100));
      check(token, String);

      if (token !== Meteor.settings.private.internalApiToken) {
        console.warn(`WARNING: Query for fires in ${lat}, ${lng} in ${km} km radius with wrong token`);
        return {};
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
      });

      return { total: fires.count(), real: countRealFires(fires) };
    }
  });
});
