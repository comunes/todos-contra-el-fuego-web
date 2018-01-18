/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import firesCommonSchema from '../Common/FiresSchema';

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

FireAlerts.schema = new SimpleSchema(firesCommonSchema);

FireAlerts.attachSchema(FireAlerts.schema);

export default FireAlerts;
