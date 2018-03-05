/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';
import { getFileNameOfLang } from '/imports/api/Utility/server/files.js';
import sendMail from '/imports/startup/server/email';
import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';

export function subjectTruncate(n = 70, useWordBoundary = true) {
  // https://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
  if (this.length <= n) {
    return `${this}`;
  }
  const subString = this.substr(0, n - 1);
  return `${useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString}...`;
}

const sendEmail = (options, { resolve, reject }) => {
  try {
    Meteor.defer(() => {
      // console.log(`Current user lang ${options.lang}`);
      i18n.changeLanguage(options.lang);
      // Meteor email options:
      // basic: from, to/cc/bcc/replyTo, subject, html, text,
      // others: watchHtml, icalEvent, headers, attachments, mailComposer, inReplyTo, references, messageId
      const opts = options;
      // opts.template = '<body><h2>{{appName}}</h2>{{{html}}}</body>';
      opts.template = '<body>{{{html}}}</body>';
      opts.appName = i18n.t('AppName');
      // console.log(`Email options: ${JSON.stringify(opts)}`);
      sendMail(opts, true);
      // Email.send(options);
      resolve();
    });
  } catch (exception) {
    reject(exception);
  }
};

export default ({
  text, html, lang, template, templateVars, ...rest
}) => {
  if (text || html || template) {
    return new Promise((resolve, reject) => {
      sendEmail({
        lang,
        ...rest,
        text: template ? templateToText(getPrivateFile(getFileNameOfLang('email-templates', template, 'txt', lang)), (templateVars || {})) : text,
        html: template ? templateToHTML(getPrivateFile(getFileNameOfLang('email-templates', template, 'html', lang)), (templateVars || {})) : html
      }, { resolve, reject });
    });
  }
  throw new Error('Please pass an HTML string, text, or template name to compile for your message\'s body.');
};
