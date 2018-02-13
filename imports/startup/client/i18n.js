/* global CookieConsent Intl */
import i18n from 'i18next';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';
import { T9n } from 'meteor-accounts-t9n';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/gl';
import i18nOpts from '../common/i18n';

// Adapted from: https://github.com/appigram/ryfma-boilerplate/blob/44c1eabfb9928b5623afab36a23997969e5beb02/imports/startup/client/i18n.js

const detectorOptions = {
  // order and from where user language should be detected
  order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'] // languages to not persist (cookie, localStorage)
};

export const i18nReady = new ReactiveVar(false);

const cacheOptions = {
  // turn on or off
  enabled: false,
  // prefix for stored languages
  prefix: 'i18next_res_',
  // expiration
  expirationTime: 7 * 24 * 60 * 60 * 1000,
  // language versions
  versions: {}
};

i18nOpts.cache = cacheOptions;
i18nOpts.detection = detectorOptions;
i18nOpts.react = {
  wait: true,
  defaultTransParent: 'span'
  // https://react.i18next.com/components/i18next-instance.ht
  /* bindI18n: 'languageChanged loaded',
   bindStore: 'added removed',
   nsMode: 'default' */
};

const sendMissing = true; // Meteor.isDevelopment;
if (sendMissing && Meteor.isDevelopment) {
  i18nOpts.sendMissing = true;
  i18nOpts.missingKeyHandler = function miss(lng, ns, key, defaultValue) {
    Meteor.call('utility.saveMissingI18n', key, defaultValue);
  };
}

i18n.use(backend)
  .use(LngDetector)
  .use(Cache)
  .init(i18nOpts, (err, t) => {
    // initialized and ready to
    if (err) {
      console.error(err);
      return;
    }
    i18nReady.set(true);
    // document.title = t('AppName');
    // Accounts translation
    // https://github.com/softwarerero/meteor-accounts-t9n
    // console.log("Language: " + i18n.language);
    T9n.setLanguage(i18n.language);
    // console.log(T9n.get('error.accounts.User not found'));

    moment.locale(i18n.language);

    // cookies eu consent
    const cookiesOpt = {
      cookieTitle: t('Uso de Cookies'),
      cookieMessage: t('Utilizamos cookies para asegurar un mejor uso de nuestra web. Si continúas navegando, consideramos que aceptas su uso'),
      /* cookieMessage: t('Uso de Cookies'),
       cookieMessageImply: t('Utilizamos cookies para asegurar un mejor uso de nuestra web. Si continúas navegando, consideramos que aceptas su uso'), */
      showLink: false,
      position: 'bottom',
      linkText: 'Lee más',
      linkRouteName: '/privacy',
      acceptButtonText: 'Aceptar',
      html: false,
      expirationInDays: 70,
      forceShow: false
    };

    CookieConsent.init(cookiesOpt);
  });

Meteor.subscribe('userData'); // lang is there

i18n.on('languageChanged', (lng) => {
  moment.locale(lng);
  T9n.setLanguage(lng);
  Tracker.autorun((computation) => {
    if (Meteor.userId()) {
      // logged
      if (Meteor.user() && (typeof Meteor.user().lang === 'undefined' ||
                            Meteor.user().lang !== lng)
      ) {
        // Set the autodetected/changed lang
        console.log(`Setting the autodetected lang ${lng}, from previous ${Meteor.user().lang}`);
        // console.log(Meteor.user());
        Meteor.call('users.setLang', lng, (error) => {
          if (error) {
            console.error(error);
          }
        });
        computation.stop(); // not need it again til new lang change
      }
    }
  });
});

export default i18n;
