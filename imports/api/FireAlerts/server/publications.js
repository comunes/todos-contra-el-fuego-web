import { Meteor } from 'meteor/meteor';
import FireAlerts from '../FireAlerts';

Meteor.publish('fireAlerts', function fireAlerts() {
  return FireAlerts.find();
});
