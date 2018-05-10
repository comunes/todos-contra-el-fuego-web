/* eslint-disable import/no-absolute-path */

import { Accounts } from 'meteor/accounts-base';
import getFallbackLang from '/imports/modules/lang-fallback';
import sendWelcomeEmail from '/imports/api/Users/server/send-welcome-email';
import getOAuthProfile from '/imports/modules/get-oauth-profile';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  // console.log(JSON.stringify(user));
  // console.log(JSON.stringify(options));

  let lang = 'en'; // fallback
  if (options.profile) {
    userToCreate.profile = options.profile;
    userToCreate.lang = options.profile.lang;
    // console.log(JSON.stringify(user));
    lang = userToCreate.lang;
    delete options.profile.lang;
  }
  const OAuthProfile = getOAuthProfile(options, user);
  if (OAuthProfile) {
    userToCreate.lang = getFallbackLang(OAuthProfile && OAuthProfile.lang ? OAuthProfile.lang : lang);
    lang = userToCreate.lang;
  }
  sendWelcomeEmail(options, userToCreate, lang);
  return userToCreate;
});
