import { Meteor } from 'meteor/meteor';
import nodemailer from 'nodemailer';
import { MailTime } from 'meteor/ostrio:mailer';
import i18n from 'i18next';

// console.log(i18n.t('Inicio del mailer'));

const transports = [];

// First transport
const fstTransport = nodemailer.createTransport(Meteor.settings.private.MAIL_URL);
transports.push(fstTransport);
// console.log(fstTransport.options.auth.user);

const db = Meteor.users.rawDatabase(); // new Mongo.Collection('__mailTimeQueue__').rawDatabase();

// Use __mailTimeQueue collection in any db
// db.getCollection("__mailTimeQueue__").count()

// https://litmus.com/community/discussions/4633-is-there-a-reliable-1px-horizontal-rule-method
const hr = `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100% !important;">
        <tr>
            <td align="left" valign="top" width="600px" height="1" style="background-color: #f0f0f0; border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-line-height-rule: exactly; line-height: 1px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
        </tr>
    </table>`;

const MailQueue = new MailTime({
  db,
  type: 'server',
  strategy: 'balancer', // Transports will be used in round robin chain
  transports,
  from(transport) {
    // To pass spam-filters `from` field should be correctly set
    // for each transport, check `transport` object for more options
    return `"${i18n.t('AppName')}" <${transport.options.auth.user}>`;
  },
  debug: true,
  concatEmails: true, // Concatenate emails to the same addressee
  concatSubject: `${i18n.t('Nuevas notificaciones de {{app}}', { app: i18n.t('AppName') })}`,
  /* eslint-disable */
  concatDelimiter: hr + '<h2>{{{subject}}}</h2>', // Start each concatenated email with it's own subject
  /* eslint-enable */
  // concatThrottling: 30,
  template: MailTime.Template // Use default template
});

// A Client (not used yet)
// const MailQueueClient = new MailTime({
//   db,
//   type: 'client',
//   debug: true,
//   strategy: 'balancer', // Transports will be used in round robin chain
//   concatEmails: true // Concatenate emails to the same address
// });

export default function sendMail(opts, debug) {
  if (debug) {
    MailQueue.sendMail(opts, (err, info) => { if (err) { console.error(err); } else { console.log(info); } });
  } else {
    MailQueue.sendMail(opts);
  }
}

if (Meteor.settings.private.testMailer) {
  const emailOpts = {
    to: Meteor.settings.private.testEmail,
    userName: 'someone',
    sendAt: new Date(),
    subject: 'Some new notification',
    text: 'Plain text message',
    template: '<body>{{appName}}<h2>{{{subject}}}</h2>{{{html}}}</body>',
    appName: i18n.t('AppName'),
    html: '<p>Styled message</p>'
  };
  sendMail(emailOpts, true);
  sendMail(emailOpts, true);
  sendMail(emailOpts, true);
  sendMail(emailOpts, true);
}
