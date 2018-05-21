import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};
const publicDSN = Meteor.settings.public.sentryPublicDSN;
const privateDSN = Meteor.settings.sentryPrivateDSN;

const ravenLogger = publicDSN && privateDSN ? new RavenLogger({
  publicDSN,
  privateDSN,
  shouldCatchConsoleError: true, // default true
  trackUser: true // default false
}, ravenOptions) : { log: (error) => { console.log(error); } };

export default ravenLogger;
