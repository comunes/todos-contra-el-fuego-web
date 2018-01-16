export const trim = function trimMess(message) {
  // Removing utf8 suffix and prefix characters used in telegram but not useful here in browser
  return message.replace(/^🔥 /, '').replace(/:$/, '');
};
