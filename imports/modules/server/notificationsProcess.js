/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import Notifications from '/imports/api/Notifications/Notifications';
import i18n from 'i18next';
import moment from 'moment';
import { dateLongFormat } from '/imports/api/Common/dates';
// import sendMail from '/imports/startup/server/email';
import sendEmail, { subjectTruncate } from '/imports/modules/server/send-email';
import { isMailServerMaster } from '/imports/startup/server/email';
// import { hr } from '/imports/startup/server/email';
import getEmailOf from '/imports/modules/get-email-of-user';
import image from 'google-maps-image-api-url';
import gcm from 'node-gcm';
import { trim } from '/imports/ui/components/NotificationsObserver/util.js';
import ravenLogger from '/imports/startup/server/ravenLogger';

let validFcmSender = true;

if (!(Meteor.settings.private.fcmApiToken && Meteor.settings.private.fcmApiToken.length > 0)) {
  console.warn('Missing settings.private.fcmApiToken key, mobile notifications will not work');
  validFcmSender = false;
}

// https://www.npmjs.com/package/google-maps-image-api-url
// https://stackoverflow.com/questions/24355007/is-there-no-way-to-embed-a-google-map-into-an-html-email
// https://developers.google.com/maps/documentation/static-maps/intro
function imgUrl(lat, lng) {
  return image({
    key: Meteor.settings.gmaps.key,
    type: 'staticmap',
    center: `${lat},${lng}`,
    size: '640x480',
    zoom: 16,
    maptype: 'hybrid',
    language: 'es',
    markers: `icon: ${Meteor.settings.private.fireIconUrl}|${lat},${lng}`
  });
}

/*
   function imgEl(lat, lng) {
   return `<img src="${imgUrl(lat, lng)}" width="640" height="480"/>`;
   } */

const processNotif = (notif) => {
  if (isMailServerMaster && validFcmSender && notif.type === 'mobile' && notif.notified !== true) {
    const fcmSender = new gcm.Sender(Meteor.settings.private.fcmApiToken);
    const user = Meteor.users.findOne({ _id: notif.userId });
    moment.locale(user.lang);
    // duplicate code below
    const body = `${trim(notif.content)}`;

    // https://firebase.google.com/docs/cloud-messaging/concept-options
    const msg = new gcm.Message();

    msg.addNotification({
      title: i18n.t('Alerta de fuego'),
      body,
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      tag: notif._id, // prevent duplication of fire notifications
      sound: 'default', // Indicates sound to be played. Supports only default currently.
      icon: 'launch_image' // 'ic_launcher'
    });

    msg.addData('id', notif._id._str);
    msg.addData('description', body);
    msg.addData('lat', notif.geo.coordinates[1]);
    msg.addData('lon', notif.geo.coordinates[0]);
    msg.addData('when', notif.when);
    msg.addData('subsId', notif.subsId._str);
    msg.addData('sealed', notif.sealed);

    const registrationTokens = [];
    if (!user.fireBaseToken) {
      console.warn('This mobile user doesn\'t have a firebase registration token');
    } else {
      registrationTokens.push(user.fireBaseToken);
      // FIXME: better join users
      if (validFcmSender) {
        fcmSender.send(msg, { registrationTokens }, Meteor.bindEnvironment(function processResult(err, response) {
          if (err) {
            console.error(`FCM error: ${err}`);
            // FIXME send to sentry
            ravenLogger.log(err);
          } else {
            // console.log(`FCM response: ${response}`);
            Notifications.update(notif._id, { $set: { notified: true, notifiedAt: new Date() } });
          }
        }));
      }
    }
  }
  if (isMailServerMaster && notif.type === 'web' && notif.emailNotified !== true) {
    const user = Meteor.users.findOne({ _id: notif.userId });
    const { firstName, emailAddress } = getEmailOf(user);

    if (emailAddress) {
      const img = imgUrl(notif.geo.coordinates[1], notif.geo.coordinates[0]);
      //    const url = imgUrl(notif.geo.coordinates[1], notif.geo.coordinates[0]);
      const fireUrl = `${Meteor.absoluteUrl('fire/')}${notif.sealed}`;
      // const fireHtmlUrl = `<a href="${fireUrl}">${i18n.t('Más información sobre este fuego')}</a>`;
      // TODO get _id of fire
      // const fireTextUrl = `${i18n.t('Más información sobre este fuego')}:\n${fireUrl}`;
      // FIXME use our map as url and static map as img
      moment.locale(user.lang);
      // moment user tz ?
      const message = `${trim(notif.content)} (${i18n.t('fireDetectedAt', { when: dateLongFormat(notif.when) })}).`;

      // TODO Comunes Address

      const emailOpts = {
        to: emailAddress,
        // userName: firstName,
        // sendAt: new Date(),
        subject: subjectTruncate.apply(message),
        // text: `${message}\n\n${fireTextUrl}\n\n`,
        // template: '<body><h2>{{appName}}</h2>{{{html}}}</body>',
        lang: user.lang,
        template: 'new-fire',
        templateVars: {
          applicationName: i18n.t('AppName'),
          firstName,
          message,
          fireUrl,
          img,
          subsUrl: Meteor.absoluteUrl('subscriptions')
        }
      };
      sendEmail(emailOpts).catch((error) => {
        throw new Meteor.Error('500', `${error}`);
      });
      // sendMail(emailOpts, true);
      Notifications.update(notif._id, { $set: { emailNotified: true, emailNotifiedAt: new Date() } });
    } else {
      // Not email or not verified -> remove notif so we don't retry to send it
      Notifications.remove({ _id: notif._id });
    }
  }
};

export default processNotif;
