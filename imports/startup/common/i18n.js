import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// Load the js langs
import es from 'meteor-accounts-t9n/build/es';
import en from 'meteor-accounts-t9n/build/en';

const backOpts = {
  // path where resources get loaded from
  loadPath: '/locales/{{lng}}/{{ns}}.json',

  // path to post missing resources
  addPath: '/locales/{{lng}}/{{ns}}.missing.json',

  // jsonIndent to use when storing json files
  jsonIndent: 2
};

const forceDebug = true;
const shouldDebug = (forceDebug && !Meteor.isProduction);

const i18nOpts = {
  backend: backOpts,
  lng: 'es',
  // fallbackLng: 'es',
  fallbackLng: {
    'en-US': ['en'],
    'en-GB': ['en'],
    'pt-BR': ['pt'],
    default: ['es']
  },
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: function f(value, format, lng) {
      // https://www.i18next.com/formatting.html
      // console.log(`Value: ${value} with format: ${format} to lang: ${lng}`);
      if (format === 'uppercase') return value.toUpperCase();
      if (value instanceof Date) return moment(value).format(format);
      if (format === 'number') return Intl.NumberFormat(lng).format(value);
      return value;
    }
  },
  whitelist: false,
  // whitelist: ['es', 'en'], // allowed languages
  load: 'all', // es-ES -> es, en-US -> en
  debug: shouldDebug,
  ns: 'common',
  defaultNS: 'common',
  saveMissing: shouldDebug, // if true seems it's fails to getResourceBundle
  saveMissingTo: 'es',
  keySeparator: 'ß',
  nsSeparator: 'ð',
  pluralSeparator: 'đ'
};

export default i18nOpts;
