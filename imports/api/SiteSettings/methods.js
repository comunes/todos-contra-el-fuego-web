import { Meteor } from 'meteor/meteor';
/* import { check } from 'meteor/check';
import SiteSettings from './SiteSettings';
import SiteSettingsTypes from './SiteSettingsTypes'; */
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
/*  'siteSettings.insert': function siteSettingsInsert(setting) {
    check(setting, {
      name: String,
      type: String,
      description: String,
      value: SiteSettingsTypes[self.type].value
    });

    SiteSettings.getSchema.validate(setting);

    try {
      return SiteSettings.insert({ owner: this.userId, ...setting });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'siteSettings.update': function siteSettingsUpdate(setting) {
    check(setting, {
      _id: String,
      name: String,
      type: String,
      description: String,
      value: SiteSettingsTypes[self.type].value
    });

    try {
      const siteSettingId = setting._id;
      SiteSettings.update(siteSettingId, { $set: setting });
      return siteSettingId; // Return _id so we can redirect to siteSetting after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'siteSettings.remove': function siteSettingsRemove(siteSettingId) {
    check(siteSettingId, String);

    try {
      return SiteSettings.remove(siteSettingId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  } */
});

rateLimit({
  methods: [
    /* 'siteSettings.insert',
    'siteSettings.update',
    'siteSettings.remove' */
  ],
  limit: 5,
  timeRange: 1000
});
