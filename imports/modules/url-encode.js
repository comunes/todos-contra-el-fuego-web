import { Meteor } from 'meteor/meteor';
import Iron from 'iron';

exports.encrypt = obj => Iron.seal(obj, Meteor.settings.private.ironPassword, Iron.defaults);

exports.decrypt = obj => Iron.unseal(obj, Meteor.settings.private.ironPassword, Iron.defaults);
