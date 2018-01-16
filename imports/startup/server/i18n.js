import { Meteor } from 'meteor/meteor';
import i18n from 'i18next';
import backend from 'i18next-sync-fs-backend';
import i18nOpts from '../common/i18n';
// import moment from 'moment';
// import { T9n } from 'meteor-accounts-t9n';

// vi ostrio:meteor-root
i18nOpts.backend.loadPath = `${Meteor.absolutePath}/public${i18nOpts.backend.loadPath}`;
i18nOpts.backend.addPath = `${Meteor.absolutePath}/public${i18nOpts.backend.addPath}`;

// console.log(i18nOpts.backend.loadPath);
i18nOpts.debug = false;
i18nOpts.saveMissing = true;
i18nOpts.initImmediate = false;

i18n
  .use(backend)
  .init(i18nOpts, (err) => {
    if (err) {
      console.error(err);
    }
  });

/* export function setUserLang (lng) {
 *   moment.locale(lng);
 *   T9n.setLanguage(lng);
 * } */

// console.log(i18n.t('Servidor arrancado'));

export default i18n;
