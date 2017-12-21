import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import i18n from 'i18next';
import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

Meteor.methods({
  'utility.getPage': function utilityGetPage(fileName) {
    check(fileName, String);
    return parseMarkdown(getPrivateFile(`pages/${fileName}.md`));
  },
  'utility.saveMissingI18n': function saveMissing(key, value) {
    check(key, String);
    check(value, String);
    if (!Meteor.isProduction) {
      i18n.t(key, value);
    }
  }
});
