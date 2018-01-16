/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Mongo } from 'meteor/mongo';
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
  content: String,
  geo: LocationSchema,
  type: String,
  webNotified: { type: Boolean, optional: true },
  webNotifiedAt: { type: Date, optional: true },
  emailNotified: { type: Boolean, optional: true },
  emailNotifiedAt: { type: Date, optional: true },
  when: Date,
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

Notifications.attachSchema(Notifications.schema);

export default Notifications;
