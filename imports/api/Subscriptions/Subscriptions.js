/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Subscriptions = new Mongo.Collection('subscriptions', { idGeneration: 'MONGO' });

Subscriptions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Subscriptions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});


/* Sample:
 * {
 *         "_id" : ObjectId("5a0bfb5a79095a1adba47513"),
 *         "chatId" : -253600015,
 *         "location" : {
 *                 "lat" : 40.234503,
 *                 "lon" : -3.350386
 *         },
 *         "geo" : {
 *                 "type" : "Point",
 *                 "coordinates" : [
 *                         -3.350386,
 *                         40.234503
 *                 ]
 *         },
 *         "distance" : 40
 * }
 * */

// https://stackoverflow.com/questions/24492333/meteor-simple-schema-for-mongo-geo-location-data
// https://github.com/aldeed/meteor-simple-schema/issues/606
const LocationSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Point']
  },
  coordinates: {
    type: Array,
    minCount: 2,
    maxCount: 2,
    custom: function custom() {
      if (!(this.value[0] >= -90 && this.value[0] <= 90)) {
        return 'lngOutOfRange';
      }
      if (!(this.value[1] >= -180 && this.value[1] <= 180)) {
        return 'latOutOfRange';
      }
      return true;
    }
  },
  'coordinates.$': {
    type: Number
  }
});

LocationSchema.messageBox.messages({
  lonOutOfRange: '[label] longitude should be between -90 and 90',
  latOutOfRange: '[label] latitude should be between -180 and 180'
});

Subscriptions.schema = new SimpleSchema({
  location: Object,
  'location.lat': Number,
  'location.lon': Number,
  geo: LocationSchema,
  distance: Number,
  owner: String,
  type: String
});

Subscriptions.attachSchema(Subscriptions.schema);

export default Subscriptions;
