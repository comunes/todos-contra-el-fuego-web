/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const Notifications = new Mongo.Collection('notifications', { idGeneration: 'MONGO' });

Notifications.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Notifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Notifications.schema = new SimpleSchema({
  userId: String,
  subsId: { type: Meteor.Collection.ObjectID, optional: true, blackbox: true },
  content: String,
  geo: LocationSchema,
  type: String,
  notified: { type: Boolean, optional: true },
  notifiedAt: { type: Date, optional: true },
  emailNotified: { type: Boolean, optional: true },
  emailNotifiedAt: { type: Date, optional: true },
  when: Date,
  sealed: String,
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

Notifications.attachSchema(Notifications.schema);

export default Notifications;
