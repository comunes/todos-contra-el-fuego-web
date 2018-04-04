import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import nodemailer from 'nodemailer';
import { MailTime } from 'meteor/ostrio:mailer';
import i18n from 'i18next';

const transports = [];

// First transport
const fstTransport = nodemailer.createTransport(Meteor.settings.private.MAIL_URL);
transports.push(fstTransport);
// console.log(fstTransport.options.auth.user);

const db = Meteor.users.rawDatabase(); // new Mongo.Collection('__mailTimeQueue__').rawDatabase();

// https://litmus.com/community/discussions/4633-is-there-a-reliable-1px-horizontal-rule-method
export const hr = `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100% !important;">
        <tr>
            <td align="left" valign="top" width="600px" height="1" style="background-color: #f0f0f0; border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-line-height-rule: exactly; line-height: 1px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
        </tr>
    </table>`;

let MailQueue;

if (Meteor.settings.private.isMailServer) {
  MailQueue = new MailTime({
    db,
    type: 'server',
    strategy: 'balancer', // Transports will be used in round robin chain
    transports,
    from(transport) {
    // To pass spam-filters `from` field should be correctly set
    // for each transport, check `transport` object for more options
      if (!Meteor.isProduction) {
      // only for test purposes
        return `${i18n.t('AppName')} <notify@example.org>`;
      }
      return `${i18n.t('AppName')} <${transport.options.auth.user}>`;
    },
    debug: Meteor.settings.private.debugMailer,
    concatEmails: true, // Concatenate emails to the same addressee
    concatSubject: `${i18n.t('Nuevas notificaciones de {{app}}', { app: i18n.t('AppName') })}`,
    /* eslint-disable */
  concatDelimiter: hr + '<h2>{{{subject}}}</h2>', // Start each concatenated email with it's own subject
  /* eslint-enable */
    // concatThrottling: 30,
    template: MailTime.Template // Use default template
  });
} else {
  MailQueue = new MailTime({
    db,
    type: 'client',
    debug: Meteor.settings.private.debugMailer,
    strategy: 'balancer', // Transports will be used in round robin chain
    concatEmails: true // Concatenate emails to the same address
  });
}

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


// Set interval to greater than 256
// https://github.com/VeliovGroup/Mail-Time/issues/5
const MailJobs = new Mongo.Collection('__JobTasks__mailTimeQueue', { idGeneration: 'MONGO' });

const updateJob = (mailJob, updated) => {
  const delay = 60000;
  if (Meteor.isDevelopment) console.log(`${updated ? 'Update old' : 'Update just added'} mailjob with ${delay} delay`);
  if (mailJob.delay !== delay) {
    MailJobs.update(mailJob._id, { $set: { delay } });
  }
};

const mailJob = MailJobs.findOne();

if (mailJob) {
  updateJob(mailJob);
}

MailJobs.find().observe({
  added: function notifAdded(item) {
    updateJob(item, false);
  },
  changed: function notifChanged(item) {
    updateJob(item, true);
  }
});
