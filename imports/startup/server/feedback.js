/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';
import { check } from 'meteor/check';
import sendEmail from '/imports/startup/server/email';

Meteor.methods({
  'send-feedback': function sendFeedback(email, feedback) {
    check(email, String);
    check(feedback, String);
    const appName = i18n.t('AppName');
    sendEmail({
      to: 'info@comunes.org',
      from: `${appName} <noreply@comunes.org>`,
      subject: `Feedback de ${email}!`,
      sendAt: new Date(),
      text: `Feedback de ${email}\n\n${feedback}`,
      html: `<p>${feedback}</p>`,
      template: '<body>{{appName}}<h2>{{{subject}}}</h2>{{{html}}}</body>',
      appName
    }, true);
  }
});
