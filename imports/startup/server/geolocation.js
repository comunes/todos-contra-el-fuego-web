import { Meteor } from 'meteor/meteor';

// https://atmospherejs.com/thebakery/ipgeocoder
Meteor.startup(function(){
  IPGeocoder.load();
});

Meteor.methods({
  geo: function() {
    // https://stackoverflow.com/questions/14843232/how-to-get-the-user-ip-address-in-meteor-server/22657421#22657421
    clientIP = this.connection.clientAddress;
    console.log(clientIP);
    var geoData = IPGeocoder.geocode('82.124.236.10');
    console.log(JSON.stringify(geoData));
    return geoData;
  }
});
