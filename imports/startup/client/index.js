/* global */
import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import '/imports/startup/client/modernizr';
import App from '../../ui/layouts/App/App';

import '../../ui/stylesheets/app.scss';

// https://stackoverflow.com/questions/19562207/jquery-detect-browser-ie9-and-below-and-throw-up-a-modal-to-upgrade
const isIE9OrBelow = () => /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split('MSIE')[1]) < 10;

if (isIE9OrBelow()) window.alert('You are using an outdated browser. Please use Chrome or Firefox to display this site.');
else {
  Modernizr.on('webp', (result) => {
    if (Meteor.isDevelopment) console.log(`webp ${result ? '' : 'not '}supported`);
  });
  Meteor.startup(() => render(<App />, document.getElementById('react-root')));
}
