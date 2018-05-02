import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};

const ravenLogger = new RavenLogger({
  publicDSN: Meteor.settings.public.sentryPublicDSN,
  privateDSN: Meteor.settings.sentryPrivateDSN,
  shouldCatchConsoleError: true, // default true
  trackUser: true // default false
}, ravenOptions);

export default ravenLogger;
