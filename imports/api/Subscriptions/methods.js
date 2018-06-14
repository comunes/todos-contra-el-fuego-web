import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Subscriptions from './Subscriptions';
import rateLimit from '../../modules/rate-limit';

function geo(doc) {
  return {
    type: 'Point',
    coordinates: [doc.location.lon, doc.location.lat]
  };
}

export function subscriptionsInsert(doc, userId, type) {
  check(doc, {
    location: Match.ObjectIncluding({ lat: Number, lon: Number }),
    distance: Number
  });
  const newDoc = {
    owner: userId,
    type,
    geo: geo(doc),
    ...doc
  };
  // console.log(newDoc);
  const already = Subscriptions.findOne(newDoc);
  if (already) {
    throw new Meteor.Error('on-already-subscribed', 'The user is already subscribed to this area');
  }
  try {
    return Subscriptions.insert(newDoc);
  } catch (exception) {
    // console.error(exception);
    throw new Meteor.Error('500', exception);
  }
}

export function subscriptionsRemove(subscriptionId) {
  check(subscriptionId, Meteor.Collection.ObjectID);

  try {
    return Subscriptions.remove(subscriptionId);
  } catch (exception) {
    console.error(exception);
    throw new Meteor.Error('500', exception);
  }
}

Meteor.methods({
  'subscriptions.insert': function subscriptionInsertMethod(doc) {
    check(doc, {
      location: Match.ObjectIncluding({ lat: Number, lon: Number }),
      distance: Number
    });
    return subscriptionsInsert(doc, this.userId, 'web');
  },
  'subscriptions.update': function subscriptionsUpdate(doc) {
    check(doc, {
      _id: Meteor.Collection.ObjectID,
      location: Match.ObjectIncluding({ lat: Number, lon: Number }),
      distance: Number
    });

    try {
      const dup = doc;
      const subscriptionId = doc._id;
      dup.geo = geo(doc);
      Subscriptions.update(subscriptionId, { $set: dup });
      return subscriptionId; // Return _id so we can redirect to subscription after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'subscriptions.remove': function subscriptionsRemoveMethod(subscriptionId) {
    check(subscriptionId, Meteor.Collection.ObjectID);
    return subscriptionsRemove(subscriptionId);
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
