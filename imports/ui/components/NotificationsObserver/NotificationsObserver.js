/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Bert } from 'meteor/themeteorchef:bert';
import moment from 'moment';
import Notifications from '/imports/api/Notifications/Notifications';
import Push from 'push.js/bin/push.min.js';
import i18n from '/imports/startup/client/i18n';
import history from '../../components/History/History';
import { trim } from './util.js';

function process(notif) {
  // No already notified
  if (Push.Permission.has()) {
    if (!notif.webNotified) {
      Push.create(i18n.t('AppName'), {
        body: `${trim(notif.content)} (${i18n.t('fireDetected', { when: moment(notif.when).fromNow() })})`,
        icon: '/n-fire-marker.png',
        requireInteraction: true,
        onClick: function onClickFocus() {
          window.focus();
          this.close();
          history.push('/fires');
        }
      });

      Meteor.call('notifications.sent', notif._id, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        }
      });
    }
  }
}

// Observe for new notifications
Notifications.find().observe({
  added: function notifAdded(notif) {
    process(notif);
  },
  changed: function notifChanged(updatedNotif, oldNotif) {
    process(updatedNotif);
  }
});

Meteor.startup(() => {
  if (Meteor.userId()) {
    Meteor.subscribe('mynotifications');
    // Check for notifications not processed at startup
    Notifications.find({ webNotified: null }).forEach((notif) => {
      process(notif);
    });
  }

  Tracker.autorun(() => {
    if (Meteor.userId()) {
      Meteor.subscribe('mynotifications');
      // console.log('Started notifications listener');
      if (!Push.Permission.has()) {
        Push.Permission.request(() => {
          // on granted
          Bert.alert(i18n.t('Perfecto, recibirás notificaciones de fuegos en este equipo y también por correo cuando no estés conectado'), 'success');
        }, () => {
          // on denied
          Bert.alert(i18n.t('No recibirás notificaciones de fuegos en este equipo, solo por correo'), 'warning');
        });
      }
    }
  });
});
