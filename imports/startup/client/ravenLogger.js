import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};

const enabled = true && !Meteor.isDevelopment;

const ravenLogger = enabled ? new RavenLogger({
  publicDSN: Meteor.settings.public.sentryPublicDSN, // will be used on the client
  shouldCatchConsoleError: true, // default
  trackUser: true // default
}, ravenOptions) : { log: (error) => { console.log(error); } };

export default ravenLogger;
