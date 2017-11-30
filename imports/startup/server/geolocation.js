import { Meteor } from 'meteor/meteor';

// https://atmospherejs.com/thebakery/ipgeocoder
Meteor.startup(function(){
  // TODO, download from time to time in :public/GeoLite2-City.mmdb.gz
  // http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
  IPGeocoder.load(Meteor.absoluteUrl() + 'GeoLite2-City.mmdb.gz');
  // load() stored it in: /tmp/GeoLite2-City.mmdb
});

Meteor.methods({
  geo: function() {
    // https://stackoverflow.com/questions/14843232/how-to-get-the-user-ip-address-in-meteor-server/22657421#22657421
    var clientIP = this.connection.clientAddress;

    if (clientIP === '127.0.0.1') {
      clientIP = '80.58.61.250' // Some Spain IP address
    }
    var geoData = IPGeocoder.geocode(clientIP);
    console.log(geoData);
    return geoData;
  }
});
