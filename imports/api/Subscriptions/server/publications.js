import { Meteor } from 'meteor/meteor';
import Subscriptions from '../Subscriptions';

Meteor.publishTransformed('userSubsToFires', function() {

  // https://en.wikipedia.org/wiki/Location_obfuscation
  // https://en.wikipedia.org/wiki/Decimal_degrees#Precision
  return Subscriptions.find().serverTransform(function(doc) {
    var location =  doc.location;
    /* doc.lat = location.lat;
     * doc.lon = location.lon;*/
    if (location) {
      doc.lat = Math.round(location.lat * 10) / 10;
      doc.lon = Math.round(location.lon * 10) / 10;
    }
    delete doc.chatId;
    delete doc.geo;
    delete doc.location;
    return doc;
  });
});
