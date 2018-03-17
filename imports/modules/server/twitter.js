import { Meteor } from 'meteor/meteor';
import Twit from 'twit';

// https://www.npmjs.com/package/twit
const confTwitter = (lang) => {
  const tConf = Meteor.settings.private.twitter[lang];

  const T = new Twit({
    consumer_key: tConf.consumer_key,
    consumer_secret: tConf.consumer_secret,
    access_token: tConf.access_token,
    access_token_secret: tConf.access_token_secret
    // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  });

  return T;
};

const tweet = (message, lang) => {
  const T = confTwitter(lang);
  T.post('statuses/update', { status: message }, (err, data, response) => {
    // console.log(data);
    // console.log(response);
  });
};

export default tweet;
