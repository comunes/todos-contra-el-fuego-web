import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Notifications from './Notifications';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'notifications.sent': function notificationsUpdate(notifId) {
    check(notifId, Meteor.Collection.ObjectID);

    try {
      Notifications.update(notifId, { $set: { webNotified: true, webNotifiedAt: new Date() } });
      return notifId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

rateLimit({
  methods: [
    'notifications.sent'
  ],
  limit: 5,
  timeRange: 1000
});
