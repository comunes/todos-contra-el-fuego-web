/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { chai } from 'meteor/practicalmeteor:chai';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import urlEnc from '/imports/modules/url-encode';

describe('url encoding', () => {
  it('should encrypt and dcrypt basic objects', async () => {
    const obj = { lat: 2 };
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    chai.expect(unsealed).to.deep.equal(obj);
  });

  it('should encrypt and dcrypt objects with date', async () => {
    const obj = { lat: 40.234503, lon: -3.350386, when: (new Date()).toString() };
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    chai.expect(unsealed).to.deep.equal(obj);
  });

  it('should encrypt complete objects', async () => {
    const obj = {
      ourid: {
        type: 'Point',
        coordinates: [
          24.813,
          9.223
        ]
      },
      type: 'modis',
      lat: 9.223,
      lon: 24.813,
      when: new Date('2017-12-13T00:00:00.000Z').toISOString(),
      scan: 1,
      track: 1,
      satellite: 'A',
      confidence: 60,
      version: '6.0NRT',
      frp: 6.5,
      daynight: null,
      brightness: 305.9,
      bright_t31: 292.6
    };

    const sealed = await urlEnc.encrypt(obj);
    const sealed2 = await urlEnc.encrypt(obj);
    // console.log(encodeURI(sealed));

    const unsealed = await urlEnc.decrypt(sealed);
    chai.expect(unsealed).to.deep.equal(obj);
    chai.expect(sealed).to.equal(encodeURI(sealed));
    chai.expect(sealed).to.not.equal(sealed2);
  });

  // This fails because Date is return as String (not as Date) and because _id
  it('should encrypt and dcrypt collection objects', async () => {
    const obj = ActiveFiresCollection.findOne();
    delete obj._id;
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    const w = unsealed.when;
    unsealed.when = new Date(w);
    const c = unsealed.createdAt;
    unsealed.createdAt = new Date(c);
    const u = unsealed.updatedAt;
    unsealed.updatedAt = new Date(u);
    chai.expect(unsealed).to.deep.equal(obj);
  });
});
