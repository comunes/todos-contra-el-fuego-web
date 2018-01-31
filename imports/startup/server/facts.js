/* global Facts */
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

Facts.setUserIdFilter((userId) => {
  const user = Meteor.users.findOne(userId);
  // console.log(`User roles: ${user.roles}`);
  return Roles.userIsInRole(userId, ['admin']);
});
