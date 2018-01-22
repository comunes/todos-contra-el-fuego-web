import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import i18n from 'i18next';
import { getFileNameOfLang } from '/imports/api/Utility/server/files.js';
import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

Meteor.methods({
  'utility.getPage': function utilityGetPage(fileName, lang) {
    check(fileName, String);
    check(lang, String);
    return parseMarkdown(getPrivateFile(getFileNameOfLang('pages', fileName, 'md', lang)));
  },
  'utility.saveMissingI18n': function saveMissing(key, value) {
    check(key, String);
    check(value, String);
    if (!Meteor.isProduction) {
      i18n.t(key, value);
    }
  }
});
