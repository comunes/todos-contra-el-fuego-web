/* global Migrations */
/* eslint-disable import/no-absolute-path */
import { Meteor } from 'meteor/meteor';

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

  Migrations.migrateTo('latest');

  // Migrations.migrateTo('1,rerun');
});
