/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import maxmind from 'maxmind';
import fs from 'fs';

process.env.HTTP_FORWARDED_COUNT = Meteor.settings.private.proxies_count;
if (!Meteor.isDevelopment) {
  console.log(`Number or proxies (needed for client IP lookup): ${process.env.HTTP_FORWARDED_COUNT}`);
}

// https://stackoverflow.com/questions/13969655/how-do-you-check-whether-the-given-ip-is-internal-or-not
function isPrivateIP(ip) {
  const parts = ip.split('.');
  return parts[0] === '10' ||
         parts[0] === '127' ||
      (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
      (parts[0] === '192' && parts[1] === '168');
}

const dbpath = '/usr/local/share/maxmind-geolite2/GeoLite2-City.mmdb';
// const dbpath = `${process.env.PWD}/private/GeoLite2-City.mmdb`;

if (!fs.existsSync(dbpath)) {
  console.error(`Maxmind db not found ${dbpath}, download via cron with https://www.npmjs.com/package/maxmind-geolite2-mirror`);
}

const IPGeocoder = maxmind.openSync(dbpath);
export default IPGeocoder;

// Warning: Meteor cannot access to this.connection with arrow functions
export function localize() {
  // https://stackoverflow.com/questions/14843232/how-to-get-the-user-ip-address-in-meteor-server/22657421#22657421
  let clientIP;
  if (this.connection && this.connection.clientAddress) {
    clientIP = this.connection.clientAddress;
  } else {
    console.warn(`We cannot get this meteor connection IP for this connection (${this.connection})`);
    clientIP = '80.58.61.250';
  }
  if (isPrivateIP(clientIP)) {
    clientIP = '80.58.61.250'; // Some Spain IP address
  }
  // console.log(`Geolocating ${clientIP}`);

  // TODO: cron download GeoLite-City
  // http://dev.maxmind.com/geoip/geoip2/geolite2/
  const geo = IPGeocoder.get(clientIP);
  // console.warn(geo);
  if (geo.location && geo.location.latitude && geo.location.longitude) {
    return geo;
  }
  // geoIP fallback, Madrid
  return { location: { latitude: 40.4146500, longitude: -3.7004000 } };
}

export const gmapKey = process.env.GMAPS_KEY || Meteor.settings.gmaps.key;
export const gmapServerKey = Meteor.settings.gmaps.serverKey;

Meteor.methods({
  geo: localize,
  getMapKey() {
    // http://meteorpedia.com/read/Environment_Variables
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    // https://console.developers.google.com/
    // export GMAPS_KEY=SomeGMapsKey
    return gmapKey;
  }
});
