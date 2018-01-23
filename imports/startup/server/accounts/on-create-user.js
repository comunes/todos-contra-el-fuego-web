import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  // console.log(JSON.stringify(user));
  // console.log(JSON.stringify(options));
  let lang = 'en'; // fallback
  if (options.profile) {
    userToCreate.profile = options.profile;
    userToCreate.lang = options.profile.lang;
    lang = options.profile.lang;
    delete options.profile.lang;
  } else {
    // TODO others (google, etc) ?
  }
  sendWelcomeEmail(options, userToCreate, lang);
  return userToCreate;
});
