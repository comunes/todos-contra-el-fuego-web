/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import SiteSettingsTypes from './SiteSettingsTypes';

const SiteSettings = new Mongo.Collection('siteSettings', { idGeneration: 'MONGO' });

SiteSettings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

SiteSettings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

SiteSettings.get = (name) => {
  const setting = SiteSettings.findOne({
    name
  });
  return typeof setting === 'object' ? setting.value : undefined;
};

SiteSettings.observe = (name, callback) => {
  SiteSettings.find({ name }).observe({
    added: (document) => {
      callback(document.value);
    }
  });
};

SiteSettings.getSchema = type => new SimpleSchema({
  name: String,
  type: String,
  description: String,
  value: SiteSettingsTypes[type].value,
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

// SiteSettings.attachSchema(SiteSettings.schema);

export default SiteSettings;
