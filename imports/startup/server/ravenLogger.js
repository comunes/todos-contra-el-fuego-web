import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};
const publicDSN = Meteor.settings.public.sentryPublicDSN;
const privateDSN = Meteor.settings.sentryPrivateDSN;
const enabled = publicDSN && privateDSN;

const ravenLogger = enabled ? new RavenLogger({
  publicDSN,
  privateDSN,
  shouldCatchConsoleError: true, // default true
  trackUser: true // default false
}, ravenOptions) : { log: (error) => { console.log(error); } };

console.log(`ravenLogger ${enabled ? 'enabled' : 'disabled'}`);

export default ravenLogger;
