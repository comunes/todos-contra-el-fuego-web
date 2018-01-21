import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import i18n from 'i18next';
import fs from 'fs';
import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

const as = f => `assets/app/${f}`;

const getFallback = (lang) => {
  if (lang === 'ast' || lang === 'gl' || lang === 'eu' || lang === 'ca') {
    return 'es';
  }
  return 'en';
};

Meteor.methods({
  'utility.getPage': function utilityGetPage(fileName, lang) {
    check(fileName, String);
    check(lang, String);
    const base = `pages/${fileName}`;
    const fallback = getFallback(lang);
    let file = `${base}-${lang}.md`;
    if (!fs.existsSync(as(file))) {
      console.log(`Page '${fileName}' not found for '${lang}' lang`);
      file = `${base}-${fallback}.md`;
      if (!fs.existsSync(as(file))) {
        console.log(`Page '${fileName}' not found for '${fallback}' lang`);
        file = `${base}.md`;
      }
    }
    return parseMarkdown(getPrivateFile(file));
  },
  'utility.saveMissingI18n': function saveMissing(key, value) {
    check(key, String);
    check(value, String);
    if (!Meteor.isProduction) {
      i18n.t(key, value);
    }
  }
});
