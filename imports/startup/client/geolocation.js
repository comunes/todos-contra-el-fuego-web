import { Meteor } from 'meteor/meteor';
const geolocation = new ReactiveVar();

Meteor.startup(function() {
  Meteor.call("geo", function (error, response) {
      if (error) {
        console.warn(error);
      } else {
        var pos = [
          response.location.latitude,
          response.location.longitude
        ];
        geolocation.set(pos);
      }
    });
});

export default geolocation;
