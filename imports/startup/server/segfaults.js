import SegfaultHandler from 'segfault-handler';
import moment from 'moment';
// import ravenLogger from './ravenLogger';

// https://github.com/ddopson/node-segfault-handler

const dateFileFormat = moment().format('YYYYMMDD_HH:mm:ss');

SegfaultHandler.registerHandler(`/var/tmp/tcef-stacktrace-${dateFileFormat}.log`);


// This callaback does not work:
// https://github.com/ddopson/node-segfault-handler/issues/49

/* SegfaultHandler.registerHandler('/var/tmp/tcef-crash.log', (signal, address, stack) => {
 *   // Do what you want with the signal, address, or stack (array)
 *   // This callback will execute before the signal is forwarded on.
 *   ravenLogger.log(stack, signal);
 * }); */

// Only uncomment for segv tests
// SegfaultHandler.causeSegfault();
