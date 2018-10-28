/* global Migrations, Comments */
/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import randomHex from 'crypto-random-hex';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import IndustryRegistries from '/imports/api/Industries/IndustryRegistries';
import Notifications from '/imports/api/Notifications/Notifications';
import ActiveFiresUnion from '/imports/api/ActiveFiresUnion/ActiveFiresUnion';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  // https://github.com/percolatestudio/meteor-migrations

  Migrations.config({
    // Log job run details to console
    log: Meteor.isProduction
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

  Migrations.add({
    version: 7,
    up: function defLangIfNull() {
      Meteor.users.find({ lang: null }).forEach((user) => {
        Meteor.users.update({ _id: user._id }, {
          $set: {
            lang: 'es'
          }
        });
      });
    }
  });

  Migrations.add({
    version: 8,
    up: function siteSettingsAddIndex() {
      SiteSettings._ensureIndex({ isPublic: 1 });
      SiteSettings.find({ isPublic: null }).forEach((setting) => {
        SiteSettings.update({ _id: setting._id }, { $set: { isPublic: true } });
      });
    }
  });

  Migrations.add({
    version: 9,
    up: function siteSettingsAddIndex() {
      Industries._ensureIndex({ registry: 1 });
      Industries._ensureIndex({ geo: '2dsphere' });
      // https://www.eea.europa.eu/data-and-maps/data/member-states-reporting-art-7-under-the-european-pollutant-release-and-transfer-register-e-prtr-regulation-16
      IndustryRegistries.insert({
        _id: '1', name: 'E-PRTR', agency: 'EEA', region: 'EU'
      });
      // https://www.epa.gov/enviro/epa-frs-facilities-state-single-file-csv-download
      IndustryRegistries.insert({
        _id: '2', name: 'FRS', agency: 'EPA', region: 'US'
      });
    }
  });

  Migrations.add({
    version: 10,
    up: function siteSettingsAddIndex() {
      IndustryRegistries.insert({
        _id: '3', name: 'NPRI', agency: 'GCODP', region: 'Canada'
      });
      IndustryRegistries.insert({
        _id: '4', name: 'NPI', agency: 'DEE', region: 'Australia'
      });
    }
  });

  Migrations.add({
    version: 11,
    up: function noAnonComments() {
      Comments.getCollection().remove({ isAnonymous: true });
    }
  });

  Migrations.add({
    version: 12,
    up: function setTelegramUsersBotId() {
      Meteor.users.update({ telegramChatId: { $ne: null }, telegramBot: null }, {
        $set: {
          telegramBot: 'es'
        }
      }, { multi: true });
    }
  });

  Migrations.add({
    version: 13,
    up: function removeTelegramBotFromUsersId() {
      Meteor.users.update({}, {
        $unset: {
          telegramBot: ''
        }
      }, { multi: true });
    }
  });

  Migrations.add({
    version: 14,
    up: function setTelegramUsersBotId() {
      UserSubsToFiresCollection.update({ chatId: { $ne: null }, telegramBot: null }, {
        $set: {
          telegramBot: 'es'
        }
      }, { multi: true });
    }
  });

  Migrations.add({
    version: 15,
    up: function moveToFalsePositivesUppercase() {
      /* const falsepositiveslower = new Mongo.Collection('falsepositives', { idGeneration: 'MONGO' });
       * falsepositiveslower.find({}).forEach((falseDoc) => {
       *   FalsePositives.insert(falseDoc);
       * });*/
      // TODO remove falsepositives lowercase collection
    }
  });

  Migrations.add({
    version: 16,
    up: function moveToFalsePositivesUppercaseWithUser() {
      const falsepositiveslower = new Mongo.Collection('falsepositives', { idGeneration: 'MONGO' });
      const now = new Date();
      falsepositiveslower.find({}).forEach((falseDoc) => {
        const user = Meteor.users.findOne({ telegramChatId: falseDoc.chatId });
        if (user) {
          falseDoc.owner= user._id;
        }
        falseDoc.type = 'industry';
        falseDoc.createdAt = now;
        falseDoc.updatedAt = now;
        FalsePositives.insert(falseDoc);
      });
    }
  });

  Migrations.add({
    version: 17,
    up: function renameWebNotifiedField() {
      Notifications.update({ webNotified: { $exists: true } }, {
        $rename: { webNotifiedAt: 'notifiedAt' }
      }, { upsert: false, multi: true });
      Notifications.update({ webNotified: { $exists: true } }, {
        $rename: { webNotified: 'notified' }
      }, { upsert: false, multi: true });
    }
  });

  Migrations.add({
    version: 18,
    up: () => {
      const raw = ActiveFiresUnion.rawCollection();
      raw.createIndex({ centerid: '2dsphere' });
      raw.createIndex({ shape: '2dsphere' });
      raw.createIndex({ when: 1 });
      raw.createIndex({ createdAt: 1 });
      raw.createIndex({ updatedAt: 1 });
    }
  });

  // Set createdAt in users & subs
  Migrations.migrateTo('latest');

  // Migrations.migrateTo('14,rerun');
});
