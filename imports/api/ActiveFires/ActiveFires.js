/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import firesCommonSchema from '../Common/FiresSchema';

const ActiveFires = new Mongo.Collection('activefires', { idGeneration: 'MONGO' });

ActiveFires.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ActiveFires.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const activeFiresSchema = firesCommonSchema;

activeFiresSchema.fireUnion = { type: Meteor.Collection.ObjectID, optional: true, blackbox: true };

ActiveFires.schema = new SimpleSchema(activeFiresSchema);

ActiveFires.attachSchema(ActiveFires.schema);

export default ActiveFires;

/* Sample:
 *     {
 *         "_id" : ObjectId("5a208d7579095a1adba48191"),
 *         "ourid" : {
 *                 "type" : "Point",
 *                 "coordinates" : [
 *                         -42.84192,
 *                         -25.54453
 *                 ]
 *         },
 *         "lat" : 9.743,
 *         "lon" : -63.483,
 *         "updatedAt" : ISODate("2017-11-30T22:02:39.644Z"),
 *         "type" : "viirs",
 *         "when" : ISODate("2017-11-30T05:30:00Z"),
 *         "acq_date" : "2017-11-30",
 *         "acq_time" : "04:12",
 *         "scan" : 0.5,
 *         "track" : 0.4,
 *         "satellite" : "N",
 *         "confidence" : "nominal",
 *         "version" : "1.0NRT",
 *         "frp" : 4.3,
 *         "daynight" : "N",
 *         "bright_ti4" : 330.2,
 *         "bright_ti5" : 291,
 *         "createdAt" : ISODate("2017-11-30T08:07:33.720Z")
 *     }
 * */
