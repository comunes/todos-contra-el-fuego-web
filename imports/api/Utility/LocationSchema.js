import SimpleSchema from 'simpl-schema';

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
      if (!(this.value[0] >= -180 && this.value[0] <= 180)) {
        return 'lngOutOfRange';
      }
      if (!(this.value[1] >= -90 && this.value[1] <= 90)) {
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
  latOutOfRange: '[label] latitude should be between -90 and 90',
  lngOutOfRange: '[label] longitude should be between -180 and 180'
});

export default LocationSchema;
