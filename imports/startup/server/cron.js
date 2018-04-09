/* global SyncedCron */
/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { tweetIberiaFires, tweetEuropeFires } from '/imports/api/ActiveFires/server/tweetFiresInZone';
import { isMailServerMaster, sendEmailsFromQueue } from '/imports/startup/server/email';

// https://github.com/thesaucecode/meteor-synced-cron/

Meteor.startup(() => {
  SyncedCron.config({
    // Log job run details to console
    log: Meteor.settings.private.cron.debug || false,

    // Use a custom logger function (defaults to Meteor's logging package)
    // workaround to disable logging succesfully
    logger: Meteor.settings.private.cron.debug ? null : () => {}

    // Name of collection to use for synchronisation and logging
    // collectionName: 'cronHistory',

    // Default to localTime
    // Options: 'utc', 'localtime', or specific timezones 'America/New_York'
    // Will be applied to jobs with no timezone defined
    // timezone: 'utc',

    /*
       TTL in seconds for history records in collection to expire
       NOTE: Unset to remove expiry but ensure you remove the index from
       mongo by hand

       ALSO: SyncedCron can't use the `_ensureIndex` command to modify
       the TTL index. The best way to modify the default value of
       `collectionTTL` is to remove the index by hand (in the mongo shell
       run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
       project. SyncedCron will recreate the index with the updated TTL.
     */
    // collectionTTL: 172800
  });

  if (isMailServerMaster) {
    SyncedCron.add({
      name: 'Send emails',
      timezone: 'Europe/Madrid',
      schedule: (parser) => {
        // http://bunkat.github.io/later/
        const sched = parser.text('every 1 min');
        if (sched.error !== -1) {
          console.error(`Mail cron 'when' field parsed with errors: ${sched.error}`);
        }
        return sched;
      },
      job: () => sendEmailsFromQueue()
    });
  }

  const esEn = Meteor.settings.private.twitter.es.enabled;
  const enEn = Meteor.settings.private.twitter.en.enabled;

  if (esEn) {
    SyncedCron.add({
      name: 'Check for fires stats in Spain and tweet about',
      timezone: 'Europe/Madrid',
      // Optionally set a positive offset if you wish to 'snooze' a schedule
      // offset: 30 * 60 * 100,
      // context: {
      //  userID: 'xyz'
      // },
      schedule: (parser) => {
        // this.magic = true; // Context is accesible here as this context.
        // parser is a later.parse object
        // return parser.text('every 2 minutes');
        // http://bunkat.github.io/later/
        const sched = parser.text(Meteor.settings.private.twitter.es.when);
        if (sched.error !== -1) {
          console.error(`Twitter cron 'when' field parsed with errors: ${sched.error}`);
        }
        return sched;
      },
      job: () => tweetIberiaFires()
      /* console.log('cron is working');
       * console.log(this.userID) // Context Object becomes this argument
       * console.log(this.magic) /
       * var numbersCrunched = CrushSomeNumbers();
       * return numbersCrunched;
         return tweetFires(); */
    });
  }

  if (enEn) {
    SyncedCron.add({
      name: 'Check for fires stats in Europe and tweet about',
      timezone: 'Europe/Madrid',
      schedule: (parser) => {
        const sched = parser.text(Meteor.settings.private.twitter.en.when);
        if (sched.error !== -1) {
          console.error(`Twitter cron 'when' field parsed with errors: ${sched.error}`);
        }
        return sched;
      },
      job: () => tweetEuropeFires()
    });
  }


  if (isMailServerMaster || esEn || enEn) {
    SyncedCron.start();
  }
});
