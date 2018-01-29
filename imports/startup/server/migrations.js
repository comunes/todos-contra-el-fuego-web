/* global Migrations */
/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import randomHex from 'crypto-random-hex';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';

Meteor.startup(() => {
  // https://github.com/percolatestudio/meteor-migrations

  Migrations.config({
    // Log job run details to console
    log: true
  });

  Migrations.add({
    version: 1,
    up: function migrateIds() {
      // https://docs.mongodb.com/manual/reference/operator/query/type/
      Meteor.users.find({ _id: { $type: 7 } }).forEach((user) => {
        const migratedUser = user;
        const id = user._id.valueOf();
        console.log(`Migrating id of user: ${JSON.stringify(user)}`);
        Meteor.users.remove({ _id: user._id });
        migratedUser._id = id;
        Meteor.users.insert(migratedUser);
      });
    }
  });

  Migrations.add({
    version: 2,
    up: function migrateSubsForeignKey() {
      UserSubsToFiresCollection.find({ owner: null }).forEach((sub) => {
        console.log(`Migrating subs of chatId: ${sub.chatId}`);
        const subsUser = Meteor.users.findOne({ telegramChatId: sub.chatId });
        if (subsUser) {
          console.log(`Migrating linking to user: ${JSON.stringify(subsUser)}`);
          UserSubsToFiresCollection.update({ _id: sub._id }, { $set: { owner: subsUser._id } });
        } else {
          // create user with chatId and def language
          const username = `tel${sub.chatId.toString().replace(/^-/, '')}`;
          console.log(`Linking to new user: ${username}`);
          const newUserId = Accounts.createUser({
            username,
            password: randomHex(50),
            profile: { name: {} }
          });
          Meteor.users.update({ _id: newUserId }, {
            $set: {
              emails: [],
              roles: ['user'],
              telegramChatId: sub.chatId,
              lang: 'es'
            }
          });
          UserSubsToFiresCollection.update({ _id: sub._id }, { $set: { owner: newUserId } });
        }
      });
    }
  });

  Migrations.add({
    version: 3,
    up: function emptySubsTypes() {
      UserSubsToFiresCollection.find({ type: null }).forEach((sub) => {
        UserSubsToFiresCollection.update({ _id: sub._id }, { $set: { type: 'telegram' } });
      });
    }
  });

  Migrations.add({
    version: 4,
    up: function deleteOldAlertFiresAndIndexes() {
      FireAlertsCollection.remove({ createdAd: null });
      const raw = FireAlertsCollection.rawCollection();
      raw.createIndex({ ourid: '2dsphere' });
      raw.createIndex({ when: 1 });
      raw.createIndex({ updatedAt: 1 });
      raw.createIndex({ createdAt: 1 });
      raw.createIndex({ ourid: 1, type: 1 });
    }
  });

  Migrations.add({
    version: 5,
    up: function siteSettingsIndex() {
      // other way:
      SiteSettings._ensureIndex({ name: 1 }, { unique: 1 });
    }
  });

  Migrations.add({
    version: 6,
    up: function falsePositiveIndexes() {
      FalsePositives._ensureIndex({ chatId: 1 });
      FalsePositives._ensureIndex({ owner: 1 });
      FalsePositives._ensureIndex({ fireId: 1 });
      FalsePositives._ensureIndex({ type: 1 });
      FalsePositives._ensureIndex({ geo: '2dsphere' });
    }
  });

  // Set createdAt in users & subs
  Migrations.migrateTo('latest');

  // Migrations.migrateTo('5,rerun');
});
