/* global Migrations */
/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import randomHex from 'crypto-random-hex';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';

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


  // Set createdAt in users & subs
  Migrations.migrateTo('latest');

  // Migrations.migrateTo('2,rerun');
});
