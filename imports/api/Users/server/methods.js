import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

const validLangCode = Match.Where((lang) => {
  check(lang, String);
  const regexp = /^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$/;
  return regexp.test(lang);
});

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },
  'users.editProfile': function usersEditProfile(profile) {
    check(profile, {
      emailAddress: String,
      profile: {
        name: {
          first: String,
          last: String
        }
      }
    });

    return editProfile({ userId: this.userId, profile })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.setLang': function userLang(lang) {
    check(lang, validLangCode);
    Meteor.users.update({ _id: this.userId }, { $set: { lang } });
  }
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile'
  ],
  limit: 5,
  timeRange: 1000
});
