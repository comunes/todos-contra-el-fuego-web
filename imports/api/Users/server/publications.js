/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import '../Users';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
      lang: 1
    }
  });
});

Meteor.publish('userData', function userData() {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {
      fields: { lang: 1 }
    });
  }
  this.ready();
});
