import { Meteor } from 'meteor/meteor';

import maxmind from 'maxmind';

// https://stackoverflow.com/questions/13969655/how-do-you-check-whether-the-given-ip-is-internal-or-not
function isPrivateIP(ip) {
   var parts = ip.split('.');
  return parts[0] === '10' ||
         parts[0] === '127' ||
      (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
      (parts[0] === '192' && parts[1] === '168');
}

Meteor.methods({
  geo: function() {

    // https://stackoverflow.com/questions/14843232/how-to-get-the-user-ip-address-in-meteor-server/22657421#22657421
    var clientIP = this.connection.clientAddress;

    if (isPrivateIP(clientIP)) {
      clientIP = '80.58.61.250' // Some Spain IP address
    }
    console.log(`Geolocating ${clientIP}`);

    // https://developers.google.com/web/fundamentals/primers/promises
    var promise = new Promise(function(resolve, reject) {
      // do a thing, possibly async, then…
      // TODO: cron download GeoLite-City
      // http://dev.maxmind.com/geoip/geoip2/geolite2/
      maxmind.open(process.env.PWD + '/private/GeoLite2-City.mmdb', (err, cityLookup) => {
        if (err) {
          reject(console.error(`Failed to geolite ${clientIP}, ${err}`));
        }
        else {
          var city = cityLookup.get(clientIP);
          // console.log(city);
          resolve(city);
        }
      });
    })
    return promise.await();
  }
});
