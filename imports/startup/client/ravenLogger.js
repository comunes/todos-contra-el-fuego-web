import RavenLogger from 'meteor/flowkey:raven';
import { Meteor } from 'meteor/meteor';

const ravenOptions = {};

const ravenLogger = new RavenLogger({
  publicDSN: Meteor.settings.public.sentryPublicDSN, // will be used on the client
  privateDSN: Meteor.settings.sentryPrivateDSN, // will be used on the server
  shouldCatchConsoleError: true, // default
  trackUser: false // default
}, ravenOptions);

export default ravenLogger;
