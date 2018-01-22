import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  console.log(JSON.stringify(user));
  console.log(JSON.stringify(options));
  if (options.profile) {
    userToCreate.profile = options.profile;
    userToCreate.lang = options.profile.lang;
    delete options.profile.lang;
  } else {
    // TODO others (google, etc) ?
  }
  sendWelcomeEmail(options, userToCreate);
  return userToCreate;
});
