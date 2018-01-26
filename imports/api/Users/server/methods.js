/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import urlEnc from '/imports/modules/url-encode';
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
  },
  'auth.getHash': async function getHash() {
    const token = Accounts._generateStampedLoginToken();
    const obj = Accounts._hashStampedToken(token);
    // console.log(obj);
    const sealed = await urlEnc.encrypt(obj);
    return sealed;
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
