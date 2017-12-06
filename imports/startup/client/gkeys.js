import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';

const gmapkey = new ReactiveVar();

Meteor.startup(function() {
  Meteor.call('getMapKey', function (error, key) {
    if (typeof key !== 'undefined') {
      // console.log(key);
      gmapkey.set(key);
    } else {
      callback(error, null)
    }
  })
});

var getGKeys = function (callback) {
  Meteor.autorun(function() {
    var key = gmapkey.get();
    if (typeof key !== 'undefined') {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = function () {
        // console.log(key);
        callback(null, key);
      };
      // https://stackoverflow.com/questions/28130114/google-maps-places-autocomplete-language-output
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=${i18n.language}`
      document.body.appendChild(script);
    }
  });
}

export default getGKeys;
