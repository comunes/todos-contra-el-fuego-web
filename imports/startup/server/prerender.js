/* global WebApp */

import { Meteor } from 'meteor/meteor';
import prerenderIO from 'prerender-node';

// NOTE: Fetch as Google needs the /?_escaped_fragment_=
// https://webmasters.stackexchange.com/questions/72819/fetch-as-google-doesnt-find-the-html-snapshot-for-my-ajax-content

// https://forums.meteor.com/t/any-guide-for-prerender-node-and-your-own-server-on-meteor/22054/9
const settings = Meteor.settings.PrerenderIO;

// https://github.com/dferber90/meteor-prerender/blob/master/server/prerender.js
const token = process.env.PRERENDERIO_TOKEN || (settings && settings.token);
const protocol = process.env.PRERENDERIO_PROTOCOL || (settings && settings.protocol);
// service url (support `prerenderServiceUrl` (for historical reasons) and `serviceUrl`)
let serviceUrl = settings && (settings.prerenderServiceUrl || settings.serviceUrl);
serviceUrl = process.env.PRERENDERIO_SERVICE_URL || serviceUrl;

Meteor.startup(() => {
  /* TODO if (!__meteor_runtime_config__.ROOT_URL.match(/www|stg|app/)) return; */

  prerenderIO.set('prerenderToken', token);

  if (serviceUrl) prerenderIO.set('prerenderServiceUrl', serviceUrl);
  prerenderIO.set('prerenderToken', token);
  if (protocol) prerenderIO.set('protocol', protocol);

  prerenderIO.set('beforeRender', (req, done) => {
    if (Meteor.isDevelopment) console.log('\nprerender before', req.headers, '\n\n');
    /* This method is intended to be used for caching, but could be used to save analytics or anything else you need to do for each crawler request. If you return a string from beforeRender, the middleware will serve that to the crawler (with status 200) instead of making a request to the prerender service. If you return an object the middleware will look for a status and body property (defaulting to 200 and "" respectively) and serve those instead. */
    done();
  });

  prerenderIO.set('afterRender', (err, req, prerender_res) => {
    /* This method is intended to be used for caching, but could be used to save analytics or anything else you need to do for each crawler request. This method is a noop and is called after the prerender service returns HTML. */
    if (err) {
      console.log('prerenderio error', err);
      return;
    }
    if (Meteor.isDevelopment) console.log('prerender after', req.url, '\nheaders:', req.headers, '\nres complete:', prerender_res.complete, prerender_res.statusCode, prerender_res.statusMessage, '\nres headers:', prerender_res.headers, '\nres body', prerender_res);
  });

  WebApp.rawConnectHandlers.use(prerenderIO);

  console.log('\nprerender service:', settings);
});
