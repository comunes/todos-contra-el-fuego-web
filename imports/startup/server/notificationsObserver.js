/* eslint-disable import/no-absolute-path */

import i18n from 'i18next';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Notifications from '/imports/api/Notifications/Notifications';
import sendMail from '/imports/startup/server/email';
import { hr } from '/imports/startup/server/email';
import getOAuthProfile from '/imports/modules/get-oauth-profile';
import image from 'google-maps-image-api-url';
import { trim } from '/imports/ui/components/NotificationsObserver/util.js';

Meteor.startup(() => {
  // https://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
  function truncate(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }
    const subString = this.substr(0, n - 1);
    return `${useWordBoundary ?
      subString.substr(0, subString.lastIndexOf(' ')) :
      subString}...`;
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

  function imgEl(lat, lng) {
    return `<img src="${imgUrl(lat, lng)}" width="640" height="480"/>`;
  }

  function process(notif) {
    if (notif.type === 'web' && !notif.emailNotified) {
      const user = Meteor.users.findOne({ _id: notif.userId });
      const hasPassword = user.services && user.services.password && user.services.password.bcrypt;

      // console.log(`Has password: ${hasPassword}`);
      const OAuthProfile = getOAuthProfile({
        password: hasPassword,
        profile: user.profile
      }, user);
      const firstName = OAuthProfile ? OAuthProfile.name.first : user.profile.name.first;
      const emailAddress = OAuthProfile ? OAuthProfile.email :
        user && user.emails[0] && user.emails[0].verified ? user.emails[0].address : null;
      if (emailAddress) {
        const img = imgEl(notif.geo.coordinates[1], notif.geo.coordinates[0]);
        const url = imgUrl(notif.geo.coordinates[1], notif.geo.coordinates[0]);
        // FIXME use our map as url and static map as img
        moment.locale(user.lang);
        const message = `${trim(notif.content)} (${i18n.t('fireDetectedAt', { when: moment(notif.when).format('LLL') })}).`;
        const emailOpts = {
          to: emailAddress,
          userName: firstName,
          sendAt: new Date(),
          subject: truncate.apply(message, [50, true]),
          text: `${message} ${url}`,
          template: '<body><h2>{{appName}}</h2>{{{html}}}</body>',
          appName: i18n.t('AppName'),
          html: `<p>${message}</p>${hr}<p>${img}</p>`
        };
        sendMail(emailOpts, true);
        Notifications.update(notif._id, { $set: { emailNotified: true, emailNotifiedAt: new Date() } });
      }
    }
  }

  Notifications.find().observe({
    added: function notifAdded(notif) {
      process(notif);
    },
    changed: function notifChanged(updatedNotif, oldNotif) {
      process(updatedNotif);
    }
  });
});
