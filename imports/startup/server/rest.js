/* global Restivus */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import Fires from '/imports/api/Fires/Fires';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';

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
   *   excludedEndpoints: ['getAll', 'put'],
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
});
