import RavenLogger from 'meteor/flowkey:raven';

var ravenOptions = {};

export const ravenLogger = new RavenLogger({
  publicDSN: Meteor.settings.public.sentryPublicDSN, // will be used on the client
  privateDSN: Meteor.settings.sentryPrivateDSN, // will be used on the server
  shouldCatchConsoleError: true, // default
  trackUser: false, // default
}, ravenOptions);
