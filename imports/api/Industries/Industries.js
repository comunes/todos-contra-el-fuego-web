/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const Industries = new Mongo.Collection('industries');

// For now using:
// https://www.eea.europa.eu/data-and-maps/data/member-states-reporting-art-7-under-the-european-pollutant-release-and-transfer-register-e-prtr-regulation-16
// https://www.epa.gov/enviro/epa-frs-facilities-state-single-file-csv-download

Industries.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Industries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Industries.schema = new SimpleSchema({
  geo: LocationSchema,
  name: { type: String, optional: true },
  registry: String
});

Industries.attachSchema(Industries.schema);

export const industriesRemap = (odoc) => {
  const doc = odoc;
  const geo = doc.geo;
  doc.lat = geo.coordinates[1];
  doc.lon = geo.coordinates[0];
  doc.id = doc._id;
  delete doc.geo;
  return doc;
};

export default Industries;
