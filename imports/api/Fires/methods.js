/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '/imports/modules/rate-limit';
import urlEnc from '/imports/modules/url-encode';

Meteor.methods({
  'fire.decrypt': async function fireDecode(fireEnc) {
    check(fireEnc, String);
    const unsealed = await urlEnc.decrypt(fireEnc);
    return unsealed;
  }
});

rateLimit({
  methods: [
    'fire.decode'
  ],
  limit: 5,
  timeRange: 1000
});
