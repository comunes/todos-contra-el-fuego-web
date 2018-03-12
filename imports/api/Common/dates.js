import moment from 'moment-timezone';

export const momentTz = date => moment.tz(date, moment.tz.guess());
export const dateLongFormat = date => momentTz(date).format('LLLL (z)');
export const dateParseShortFormat = date => moment(date, 'YYYY-MM-DD').format('LL');
export const dateYYYYMMDD = date => moment(date).format('YYYY-MM-DD');
export const dateFromNow = date => momentTz(date).fromNow();
