/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Subscriptions from '../Subscriptions';

Meteor.publish('mysubscriptions', function subscriptions() {
  return Subscriptions.find({ owner: this.userId }); // type: 'web'
});

// Note: subscriptions.view is also used when editing an existing subscription.
Meteor.publish('subscriptions.view', function subscriptionsView(subscriptionId) {
  check(subscriptionId, String);
  const id = new Mongo.ObjectID(subscriptionId);
  check(id, Meteor.Collection.ObjectID);
  return Subscriptions.find({ _id: id, owner: this.userId, type: 'web' });
});
