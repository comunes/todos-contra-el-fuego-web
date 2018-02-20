/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const FalsePositives = new Mongo.Collection('falsePositives', { idGeneration: 'MONGO' });

FalsePositives.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

FalsePositives.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

FalsePositives.schema = new SimpleSchema({
  geo: LocationSchema,
  fireId: { type: Meteor.Collection.ObjectID, optional: true, blackbox: true },
  chatId: { type: Number, optional: true }, // only in 'telegram' type
  owner: String,
  type: String,
  when: Date,
  whendateformat: String,
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

FalsePositives.attachSchema(FalsePositives.schema);

export const falsePositivesRemap = (odoc) => {
  const doc = odoc;
  const geo = doc.geo;
  doc.lat = geo.coordinates[1];
  doc.lon = geo.coordinates[0];
  doc._id = doc.fireId;
  doc.id = doc.fireId;
  delete doc.geo;
  return doc;
};

export default FalsePositives;
