/* global Comments */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';
import sendEmail, { subjectTruncate } from '/imports/modules/server/send-email';
import getEmailOf from '/imports/modules/get-email-of-user';
import '../common/comments';

/* import i18n from 'i18next';
import moment from 'moment';
import { dateLongFormat } from '/imports/api/Common/dates';
import Notifications from '/imports/api/Notifications/Notifications';
// import sendMail from '/imports/startup/server/email';
// import { hr } from '/imports/startup/server/email';
import getOAuthProfile from '/imports/modules/get-oauth-profile';
import image from 'google-maps-image-api-url';
import { trim } from '/imports/ui/components/NotificationsObserver/util.js'; */

Meteor.startup(() => {
  // On Server or Client (preferably on Server)
  Comments.config({
    onEvent: (name, action, payload) => {
      // e.g send a mail
      // console.log(`name: ${name}, action: ${action}, payload: ${JSON.stringify(payload)}`);

      // Samples:

      // name: comment, action: add, payload: {"referenceId":"fire-56a9cc5a5586879eb9cc6dd7","content":"asdfasdf asd fasd fas","userId":"tdK4e43ikjDXct7Gj","isAnonymous":false,"createdAt":"2018-03-04T14:53:40.319Z","likes":[],"dislikes":[],"replies":[],"media":{},"status":"approved","starRatings":[],"ratingScore":0,"_id":"mfAe3HL9qNofhiAnh"}
      // name: reply, action: add, payload: {"replyId":"teSLaz4f8RxHjptBm","content":"sas fasdfasdasdf","userId":"tdK4e43ikjDXct7Gj","createdAt":"2018-03-04T14:54:56.965Z","replies":[],"likes":[],"lastUpdatedAt":"2018-03-04T14:54:56.965Z","isAnonymous":false,"status":"approved","media":{},"ratingScore":0,"_id":"DyHt28rF6rTDnC5fP","rootUserId":"tdK4e43ikjDXct7Gj"}
      // name: reply, action: like, payload: {"replyId":"teSLaz4f8RxHjptBm","content":"sas fasdfasdasdf","userId":"tdK4e43ikjDXct7Gj","createdAt":"2018-03-04T14:54:56.965Z","replies":[],"likes":["tdK4e43ikjDXct7Gj"],"lastUpdatedAt":"2018-03-04T14:54:56.965Z","isAnonymous":false,"status":"approved","media":{},"ratingScore":1,"_id":"DyHt28rF6rTDnC5fP","ratedUserId":"tdK4e43ikjDXct7Gj","rootUserId":"tdK4e43ikjDXct7Gj"}
      // name: comment, action: like, payload: {"_id":"mfAe3HL9qNofhiAnh","ratedUserId":"tdK4e43ikjDXct7Gj"}
      // name: reply, action: edit, payload: {"_id":"DyHt28rF6rTDnC5fP","replyId":"teSLaz4f8RxHjptBm","content":"sas fasdfasdasdf dasd fadsfa","userId":"tdK4e43ikjDXct7Gj","createdAt":"2018-03-04T14:54:56.965Z","replies":[],"likes":[],"lastUpdatedAt":"2018-03-04T14:54:56.965Z","isAnonymous":false,"status":"approved","media":{},"ratingScore":0,"starRatings":[],"ratedUserId":"tdK4e43ikjDXct7Gj","rootUserId":"tdK4e43ikjDXct7Gj"}
      // name: reply, action: remove, payload: {"_id":"DyHt28rF6rTDnC5fP","rootUserId":"tdK4e43ikjDXct7Gj"}

      // name: (comment|reply)
      // action: (add|like|edit|remove)

      if (name === 'comment' && action.match(/add|like|edit/)) {
        if (action === 'add') {
          // Check for other users that did comments and send an email (uniq users, and not this user)
          // console.log(payload.referenceId);
          const query = payload.isAnonymous ?
            { referenceId: payload.referenceId } :
            { referenceId: payload.referenceId, userId: { $ne: payload.userId } };
          Comments.getCollection().rawCollection().distinct('userId', query).then((users) => {
            // console.log(users);
            const path = payload.referenceId.replace(/fire-/, 'fire/archive/');
            const fireUrl = Meteor.absoluteUrl(path);
            // console.log(fireUrl);
            Meteor.users.find({ _id: { $in: users } }).forEach((user) => {
              const { firstName, emailAddress } = getEmailOf(user);
              // console.log(JSON.stringify(user));
              if (emailAddress) {
                const emailOpts = {
                  to: emailAddress,
                  subject: subjectTruncate.apply(i18n.t('Hay más información sobre un fuego')),
                  lang: user.lang,
                  template: 'new-fire-comment',
                  templateVars: {
                    applicationName: i18n.t('AppName'),
                    firstName,
                    fireUrl
                  }
                };
                sendEmail(emailOpts).catch((error) => {
                  throw new Meteor.Error('500', `${error}`);
                });
              }
            });
          });
        }
      }
      if (name === 'reply' && action.match(/add|like|edit/)) {
        // Check for other previous users to this thread and send an email
        // console.log('Reply op');
      }
    }
  });
});
