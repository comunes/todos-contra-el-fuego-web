import { Meteor } from 'meteor/meteor';
import Subscriptions from '../Subscriptions';
import Perlin from 'loms.perlin';

Perlin.seed(Math.random());

Meteor.publishTransformed('userSubsToFires', function () {
  // https://en.wikipedia.org/wiki/Location_obfuscation
  // https://en.wikipedia.org/wiki/Decimal_degrees#Precision
  // https://gis.stackexchange.com/questions/27792/what-simple-effective-techniques-for-obfuscating-points-are-available
  return Subscriptions.find().serverTransform(function (doc) {
    var location = doc.location;
    /* doc.lat = location.lat;
     * doc.lon = location.lon; */
    if (location) {
      doc.lat = Math.round(location.lat * 10) / 10;
      doc.lon = Math.round(location.lon * 10) / 10;
    }
    // console.log(`[${doc.lat}, ${doc.lon}]`);
    var noiseBase = Perlin.perlin2(doc.lat, doc.lon);
    var noise = Math.abs(noiseBase / 3);
    // console.log(`Noise ${noise}, abs: ${Math.abs(noise)}`);
    doc.lat += noise;
    doc.lon += noise;
    doc.distance += noiseBase;
    // console.log(`with noise: [${doc.lat}, ${doc.lon}]`);
    delete doc.chatId;
    delete doc.geo;
    delete doc.location;
    return doc;
  });
});
