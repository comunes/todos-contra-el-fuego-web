/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const Subscriptions = new Mongo.Collection('subscriptions', { idGeneration: 'MONGO' });

Subscriptions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Subscriptions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


/* Sample:
 * {
 *         "_id" : ObjectId("5a0bfb5a79095a1adba47513"),
 *         "chatId" : -253600015,
 *         "location" : {
 *                 "lat" : 40.234503,
 *                 "lon" : -3.350386
 *         },
 *         "geo" : {
 *                 "type" : "Point",
 *                 "coordinates" : [
 *                         -3.350386,
 *                         40.234503
 *                 ]
 *         },
 *         "distance" : 40
 * }
 * */


Subscriptions.schema = new SimpleSchema({
  _id: { type: Meteor.Collection.ObjectID, optional: true, blackbox: true },
  location: Object,
  'location.lat': Number,
  'location.lon': Number,
  geo: LocationSchema,
  distance: Number,
  chatId: { type: Number, optional: true }, // only in 'telegram' type
  telegramBot: { type: String, optional: true }, // only in 'telegram' type
  owner: String,
  type: String,
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

Subscriptions.attachSchema(Subscriptions.schema);

export default Subscriptions;
