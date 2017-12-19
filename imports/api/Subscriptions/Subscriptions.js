/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
  location: Object,
  'location.lat': Number,
  'location.lon': Number,
  distance: Number,
  owner: String,
  type: String
});

Subscriptions.attachSchema(Subscriptions.schema);

export default Subscriptions;
