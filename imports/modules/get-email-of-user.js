/* eslint-disable import/no-absolute-path */

import getOAuthProfile from '/imports/modules/get-oauth-profile';

const getEmailOf = (user) => {
  const hasPassword = user.services && user.services.password && user.services.password.bcrypt;

  // console.log(`Has password: ${hasPassword}`);
  const OAuthProfile = getOAuthProfile({
    password: hasPassword,
    profile: user.profile
  }, user);
  const firstName = OAuthProfile ? OAuthProfile.name.first : user.profile.name.first;
  const emailAddress = OAuthProfile ? OAuthProfile.email :
    user && user.emails[0] && user.emails[0].verified ? user.emails[0].address : null;
  return { emailAddress, firstName };
};

export default getEmailOf;
