/* global reconnecToServer */

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Reconnect Function
  reconnectToServer(5000, true);
});
