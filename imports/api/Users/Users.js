/* eslint-disable consistent-return */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { defaultCreatedAt, defaultUpdateAt } from '/imports/api/Utility/Utils.js';

const schemaUserProfile = new SimpleSchema({
  /* Our users has a name of type Object while Google Service, for instance, String, so blackbox in true in profile */
  /* name: { type: String, optional: true }, */
  name: { type: Object, optional: true },
  'name.first': String,
  'name.last': String
});

const schemaUser = new SimpleSchema({
  username: {
    type: String,
    // i18nLabel: 'Usuario/a',
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    // For accounts-password, either emails or username is required,
    // but not both.
    // It is OK to make this optional here because the accounts-password
    // package
    // does its own validation.
    // Third-party login packages may not require either.
    // Adjust this schema as necessary for your usage.
    optional: true
  },
  emails: {
    type: Array,
    min: 1,
    // label() { return i18n.t('Lista de emails de contacto'); },
    // For accounts-password, either emails or username is required,
    // but not both.
    // It is OK to make this optional here because the accounts-password
    // package
    // does its own validation.
    // Third-party login packages may not require either.
    // Adjust this schema as necessary for your usage.
    optional: true
  },
  'emails.$': {
    label: false,
    type: Object
  },
  'emails.$.address': {
    type: String,
    label: '',
    regEx: SimpleSchema.RegEx.Email
  },
  'emails.$.verified': {
    type: Boolean,
    optional: true // if not present === notVerified
  },
  // Make sure this services field is in your schema
  // if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    // autoform: { type: 'hidden' },
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //  type: Object,
  //  optional: true,
  //  autoform: { type: 'hidden' },
  //  blackbox: true
  // }
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: { type: Array, optional: true },
  'roles.$': { type: String, optional: true },
  // https://github.com/todda00/meteor-friendly-slugs/issues/1
  friendlySlugs: {
    type: Object,
    optional: true,
    blackbox: true
  },
  slug: {
    type: String,
    optional: true
  },
  profile: {
    type: schemaUserProfile,
    optional: true,
    blackbox: true
  },
  // https://guide.meteor.com/accounts.html#custom-user-data

  /* Our users has a name of type Object while Google Service, for instance, not */
  /* name: { type: String, optional: true }, */
  /* name: Object,
  'name.first': String,
  'name.last': String, */
  lang: { type: String, optional: true },
  telegramChatId: { type: SimpleSchema.Integer, optional: true },
  telegramUsername: { type: String, optional: true },
  telegramFirstName: { type: String, optional: true },
  telegramLanguageCode: { type: String, optional: true },
  fireBaseToken: { type: String, optional: true },
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

Meteor.users.attachSchema(schemaUser);
