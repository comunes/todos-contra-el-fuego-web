/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const FireAlerts = new Mongo.Collection('avisosfuego', { idGeneration: 'MONGO' });

FireAlerts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

FireAlerts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

/* Sample:
 *         "_id" : ObjectId("5a059c4879095a1adba47507"),
 *         "chatId" : null,
 *         "location" : {
 *                 "lat" : 40.2324096,
 *                 "lon" : -3.3514863,
 *                 "text" : null
 *         },
 *         "aviso" : ISODate("2017-11-10T12:32:08.973Z"),
 *         "dateformat" : "20171110",
 *         "geo" : {
 *                 "type" : "Point",
 *                 "coordinates" : [
 *                         -3.3514863,
 *                         40.2324096
 *                 ]
 *         }
 * }
 * */


FireAlerts.schema = new SimpleSchema({
  location: Object,
  'location.lat': SimpleSchema.Integer,
  'location.lon': SimpleSchema.Integer,
  aviso: Date
});

FireAlerts.attachSchema(FireAlerts.schema);

export default FireAlerts;
