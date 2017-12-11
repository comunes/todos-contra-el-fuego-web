import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import i18n from 'i18next';
import { Tracker } from 'meteor/tracker';

class GkeysC {
  constructor() {
    this.gmapkey = new ReactiveVar(null);
    const self = this;
    this.callbacks = [];
    Meteor.startup(() => {
      Meteor.call('getMapKey', (error, key) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = () => {
          self.gmapkey.set(key);
          console.log('GMaps script just loaded');
          self.doCallbacks(key);
        };
        // https://stackoverflow.com/questions/28130114/google-maps-places-autocomplete-language-output
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=${i18n.language}`;
        document.body.appendChild(script);
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
        console.log(`GMaps already loaded:`);
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
