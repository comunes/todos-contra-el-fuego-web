/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import SiteSettings from '../SiteSettings';

Meteor.publish('settings', () => SiteSettings.find());
