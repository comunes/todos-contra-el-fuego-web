import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Subscriptions from './Subscriptions';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'subscriptions.insert': function subscriptionsInsert(doc) {
    check(doc, {
      location: Match.ObjectIncluding({ lat: Number, lon: Number }),
      distance: Number
    });

    try {
      return Subscriptions.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'subscriptions.update': function subscriptionsUpdate(doc) {
    check(doc, {
      _id: Meteor.Collection.ObjectID,
      location: Match.ObjectIncluding({ lat: Number, lon: Number }),
      distance: Number
    });

    try {
      const subscriptionId = doc._id;
      Subscriptions.update(subscriptionId, { $set: doc });
      return subscriptionId; // Return _id so we can redirect to subscription after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'subscriptions.remove': function subscriptionsRemove(subscriptionId) {
    check(subscriptionId, Meteor.Collection.ObjectID);

    try {
      return Subscriptions.remove(subscriptionId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

rateLimit({
  methods: [
    'subscriptions.insert',
    'subscriptions.update',
    'subscriptions.remove'
  ],
  limit: 5,
  timeRange: 1000
});
