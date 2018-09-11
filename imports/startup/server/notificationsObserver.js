/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import Notifications from '/imports/api/Notifications/Notifications';
import processNotif from '/imports/modules/server/notificationsProcess.js';
import { isMailServerMaster } from '/imports/startup/server/email';

Meteor.startup(() => {
  if (isMailServerMaster) {
    Notifications.find().observe({
      added: function notifAdded(notif) {
        processNotif(notif);
      },
      changed: function notifChanged(updatedNotif) { // , oldNotif) {
        processNotif(updatedNotif);
      }
    });
  }
});
