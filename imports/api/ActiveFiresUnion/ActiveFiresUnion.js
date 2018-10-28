/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';

const ActiveFiresUnion = new Mongo.Collection('activefiresunion', { idGeneration: 'MONGO' });

/* Sample:
 *
 * TODO
 *
 * */

// We have to store polygons and their centroids
// {"type":"Polygon","coordinates":[[[-5.8645,43.5524],[-5.8621,43.5524],[-5.8621,43.5546],[-5.8645,43.5546],[-5.8645,43.5524]]]}

ActiveFiresUnion.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ActiveFiresUnion.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

// https://www.npmjs.com/package/simpl-schema
const GeoJsonSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Polygon']
  },
  coordinates: {
    type: Array
  },
  'coordinates.$': {
    type: Array
  },
  'coordinates.$.$': {
    type: Array
  },
  'coordinates.$.$.$': {
    type: Number
  }
});

const firesUnionSchema = {
  centerid: LocationSchema,

  // https://docs.mongodb.com/manual/reference/geojson/
  // <field>: { type: <GeoJSON type> , coordinates: <coordinates> }
  shape: GeoJsonSchema,
  history: { type: Array, optional: true },
  'history.$': GeoJsonSchema,

  when: Date, // First date

  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
};

ActiveFiresUnion.schema = new SimpleSchema(firesUnionSchema);

ActiveFiresUnion.attachSchema(ActiveFiresUnion.schema);

export default ActiveFiresUnion;
