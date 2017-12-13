import { Meteor } from 'meteor/meteor';
import maxmind from 'maxmind';

// https://stackoverflow.com/questions/13969655/how-do-you-check-whether-the-given-ip-is-internal-or-not
function isPrivateIP(ip) {
  const parts = ip.split('.');
  return parts[0] === '10' ||
         parts[0] === '127' ||
      (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
      (parts[0] === '192' && parts[1] === '168');
}

const IPGeocoder = maxmind.openSync(`${process.env.PWD}/private/GeoLite2-City.mmdb`);
export default IPGeocoder;

Meteor.methods({
  geo() {
    // https://stackoverflow.com/questions/14843232/how-to-get-the-user-ip-address-in-meteor-server/22657421#22657421
    let clientIP = this.connection.clientAddress;

    if (isPrivateIP(clientIP)) {
      clientIP = '80.58.61.250'; // Some Spain IP address
    }
    // console.log(`Geolocating ${clientIP}`);

    // TODO: cron download GeoLite-City
    // http://dev.maxmind.com/geoip/geoip2/geolite2/
    const location = IPGeocoder.get(clientIP);
    // console.log(location);
    return location;
  },
  getMapKey() {
    // http://meteorpedia.com/read/Environment_Variables
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    // https://console.developers.google.com/
    // export GMAPS_KEY=SomeGMapsKey
    return process.env.GMAPS_KEY || Meteor.settings.gmaps.key;
  }
});
