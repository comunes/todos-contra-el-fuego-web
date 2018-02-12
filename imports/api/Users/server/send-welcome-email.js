import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';
import sendEmail from '../../../modules/server/send-email';
import getOAuthProfile from '../../../modules/get-oauth-profile';

export default (options, user, lang) => {
  const OAuthProfile = getOAuthProfile(options, user);

  i18n.changeLanguage(lang);
  const applicationName = i18n.t('AppName');
  const firstName = OAuthProfile ? OAuthProfile.name.first : options.profile.name.first;
  const emailAddress = OAuthProfile ? OAuthProfile.email : options.email;
  const welcome = i18n.t('welcome');
  if (emailAddress) {
    sendEmail({
      to: emailAddress,
      from: `${applicationName} <noreply@comunes.org>`,
      subject: `[${applicationName}] ${welcome} ${firstName}!`,
      lang,
      template: 'welcome',
      templateVars: {
        applicationName,
        firstName,
        welcomeUrl: Meteor.absoluteUrl('subscriptions') // e.g., returns http://localhost:3000/documents
      }
    }).catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  }
};
