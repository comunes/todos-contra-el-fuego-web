import React from 'react';
import { translate } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Blaze from 'meteor/gadicc:blaze-react-component';

const Reconnect = props => (
  <Blaze template="meteorStatus" lang={props.i18n.language} />
);

export default translate([], { wait: true })(Reconnect);

if (!Meteor.isProduction) {
  // We clear the console on disconnect during development
  Tracker.autorun(() => {
    if (Meteor.status().status === 'waiting') {
      // console.clear();
    }
  });
}
