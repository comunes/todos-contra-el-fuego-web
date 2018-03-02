import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Meteor.startup(() => Tracker.autorun(() => {
  const userId = Meteor.userId();
  Meteor.Piwik.setUserInfo(userId);
}));
