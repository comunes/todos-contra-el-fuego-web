/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import Notifications from '../Notifications';

Meteor.publish('mynotifications', function notifications() {
  const notif = Notifications.find({ userId: this.userId, type: 'web', notified: null });
  // console.log(`Notifications for user ${this.userId}: ${notif.count()}`);
  return notif;
});
