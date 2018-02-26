/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const IndustryRegistries = new Mongo.Collection('industryregistries', { idGeneration: 'MONGO' });

IndustryRegistries.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

IndustryRegistries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

IndustryRegistries.schema = new SimpleSchema({
  name: String,
  agency: String,
  region: String

});

IndustryRegistries.attachSchema(IndustryRegistries.schema);

export default IndustryRegistries;
