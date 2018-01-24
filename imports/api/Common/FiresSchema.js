/* eslint-disable import/no-absolute-path */

import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';
import LocationSchema from '/imports/api/Utility/LocationSchema.js';

const firesCommonSchema = {
  ourid: LocationSchema,
  lat: Number,
  lon: Number,
  type: String,
  when: Date,

  // Neighbour notified fires

  owner: { type: String, optional: true },
  dateformat: { type: String, optional: true },
  ourversion: { type: String, optional: true },

  // NASA types
  address: { type: String, optional: true }, // reverse geo
  scan: { type: Number, optional: true },
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

  // common
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
};

export default firesCommonSchema;
