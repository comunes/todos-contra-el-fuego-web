import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import GoogleMapsLoader from 'google-maps';

class GkeysC {
  constructor() {
    this.gmapkey = new ReactiveVar(null);
    const self = this;
    this.callbacks = [];
    Meteor.startup(() => {
      Meteor.call('getMapKey', (error, key) => {
        // console.log(google.maps);
        GoogleMapsLoader.KEY = key;
        GoogleMapsLoader.LIBRARIES = ['places'];
        GoogleMapsLoader.load(() => {
          self.gmapkey.set(key);
          console.log('GMaps script just loaded');
          self.doCallbacks(key);
        });
      });
    });
  }

  doCallbacks(key) {
    for (let i = 0; i < this.callbacks.length; i += 1) {
      this.callbacks[i](null, key);
    }
    this.callbacks = [];
  }

  load(callback) {
    this.callbacks.push(callback);
    Tracker.autorun((computation) => {
      const key = this.gmapkey.get();
      if (key) {
        // already loaded
        console.log('GMaps already loaded');
        this.doCallbacks(key);
        computation.stop();
      } else {
        console.log('Waiting for the gkey');
      }
    });
  }
}

const Gkeys = new GkeysC();

export default Gkeys;
