/* eslint-disable import/no-absolute-path */

import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const firesCommonSchema = {
  ourid: LocationSchema,
  lat: Number,
  lon: Number,
  scan: Number,
  type: String,
  when: Date,
  track: { type: Number, optional: true },
  acq_date: { type: String, optional: true },
  acq_time: { type: String, optional: true },
  satellite: { type: String, optional: true },
  confidence: { type: Number, optional: true },
  version: { type: String, optional: true },
  frp: { type: Number, optional: true },
  daynight: { type: String, optional: true },
  brightness: { type: Number, optional: true },
  bright_t31: { type: Number, optional: true },
  bright_ti4: { type: Number, optional: true },
  bright_ti5: { type: Number, optional: true },
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
};

export default firesCommonSchema;
