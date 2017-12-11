import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const geolocation = new ReactiveVar();

Meteor.startup(() => {
  Meteor.call('geo', (error, response) => {
    if (error) {
      console.warn(error);
    } else {
      const pos = [
        response.location.latitude,
        response.location.longitude
      ];
      geolocation.set(pos);
    }
  });
});

export default geolocation;
