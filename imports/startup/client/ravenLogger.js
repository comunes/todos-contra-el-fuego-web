import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};
const publicDSN = Meteor.settings.public.sentryPublicDSN;
const enabled = !Meteor.isDevelopment && publicDSN;

const ravenLogger = enabled ? new RavenLogger({
  publicDSN, // will be used on the client
  shouldCatchConsoleError: true, // default
  trackUser: true // default
}, ravenOptions) : { log: (error) => { console.log(error); } };

console.log(`ravenLogger ${enabled ? 'enabled' : 'disabled'}`);

export default ravenLogger;
