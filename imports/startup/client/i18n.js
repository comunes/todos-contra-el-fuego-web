import i18n from 'i18next';
import backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';
import { T9n } from 'meteor-accounts-t9n';
import en from 'meteor-accounts-t9n/build/en';
import es from 'meteor-accounts-t9n/build/es';

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
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
};

const cacheOptions = {
  // turn on or off
  enabled: false,
  // prefix for stored languages
  prefix: 'i18next_res_',
  // expiration
  expirationTime: 7 * 24 * 60 * 60 * 1000,
  // language versions
  versions: {},
};

var backOpts = {
  // path where resources get loaded from
  loadPath: '/locales/{{lng}}/{{ns}}.json',

  // path to post missing resources
  addPath: '/locales/{{lng}}/{{ns}}.missing.json',

  // jsonIndent to use when storing json files
  jsonIndent: 2
};

T9N_LANGUAGES='es,en';

i18n.use(backend)
  .use(LngDetector)
  .use(Cache)
  .init({
    backend: backOpts,
    lng: 'es',
    //fallbackLng: 'es',
    fallbackLng: {
      'en-US': ['en'],
      'en-GB': ['en'],
      'pt-BR': ['pt'],
      'default': ['es']
    },
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    whitelist: false,
    // whitelist: ['es', 'en'], // allowed languages
    load: 'all', // es-ES -> es, en-US -> en
    debug: true,
    ns: 'common',
    defaultNS: 'common',
    saveMissing: true, // if true seems it's fails to getResourceBundle
    saveMissingTo: 'es',
    keySeparator: 'ß',
    nsSeparator: 'ð',
    pluralSeparator: 'đ',
    cache: cacheOptions,
    detection: detectorOptions,
    react: {
      wait: true,
      // https://react.i18next.com/components/i18next-instance.ht
      /* bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default' */
    }
  }, function(err, t) {
    // initialized and ready to
    document.title = t("AppName");
    // https://github.com/softwarerero/meteor-accounts-t9n
    console.log("Language: " + i18n.language);
    T9n.setLanguage(i18n.language);
    console.log(T9n.get('error.accounts.User not found'));
  });

export default i18n;
