/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import ravenLogger from '/imports/startup/server/ravenLogger';

Meteor.startup(() => {
  const bound = Meteor.bindEnvironment((callback) => { callback(); });
  process.on('uncaughtException', (err) => {
    bound(() => {
      // console.error('Server crashed!', err);
      console.error(err);
      // console.error(err.stack);

      // https://github.com/flowkey/meteor-raven
      ravenLogger.log(err);

      // https://github.com/nodejs/node-v0.x-archive/blob/master/doc/api/process.markdown#exit-codes
      process.exit(7);
    });
  });
});
