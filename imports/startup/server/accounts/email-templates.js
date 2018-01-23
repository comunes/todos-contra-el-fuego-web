import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'i18next';
import { getFileNameOfLang } from '/imports/api/Utility/server/files.js';
import getPrivateFile from '../../../modules/server/get-private-file';
import templateToHTML from '../../../modules/server/handlebars-email-to-html';
import templateToText from '../../../modules/server/handlebars-email-to-text';

const name = (lang) => {
  i18n.changeLanguage(lang);
  return i18n.t('AppName');
};
const email = '<noreply@comunes.org>';
const from = `${name('en')} ${email}`;
// const from = 'noreply@comunes.org';
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.verifyEmail = {
  subject(user) {
    i18n.changeLanguage(user.lang);
    const msg = i18n.t('Verifica tu dirección de correo');
    return `[${name(user.lang)}] ${msg}`;
  },
  html(user, url) {
    return templateToHTML(getPrivateFile(getFileNameOfLang('email-templates', 'verify-email', 'html', user.lang)), {
      applicationName: name(user.lang),
      firstName: user.profile.name.first,
      verifyUrl: url.replace('#/', '')
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Verify Email Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile(getFileNameOfLang('email-templates', 'verify-email', 'txt', user.lang)), {
      applicationName: name(user.lang),
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash
    });
  }
};

emailTemplates.resetPassword = {
  subject(user) {
    i18n.changeLanguage(user.lang);
    const msg = i18n.t('Resetea tu contraseña');
    return `[${name(user.lang)}] ${msg}`;
  },
  html(user, url) {
    return templateToHTML(getPrivateFile(getFileNameOfLang('email-templates', 'reset-password', 'html', user.lang)), {
      firstName: user.profile.name.first,
      applicationName: name(user.lang),
      emailAddress: user.emails[0].address,
      resetUrl: url.replace('#/', '')
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Reset Password Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile(getFileNameOfLang('email-templates', 'reset-password', 'txt', user.lang)), {
      firstName: user.profile.name.first,
      applicationName: name(user.lang),
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash
    });
  }
};
