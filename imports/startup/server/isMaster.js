/* eslint-disable import/no-absolute-path */

import pm2Master from 'pm2-master';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if (pm2Master.isMaster()) {
    console.log('This is the master process');
  } else {
    console.log('This is a worker process');
  }
});

const isMaster = () => pm2Master.isMaster();

export default isMaster;
