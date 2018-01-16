/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import firesCommonSchema from '../Common/FiresSchema';

const Fires = new Mongo.Collection('fires', { idGeneration: 'MONGO' });

Fires.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Fires.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Fires.schema = new SimpleSchema(firesCommonSchema);

Fires.attachSchema(Fires.schema);

export default Fires;
