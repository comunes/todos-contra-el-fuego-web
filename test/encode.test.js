/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import urlEnc from '/imports/modules/url-encode';
import seeder from '@cleverbeagle/seeder';
import { Accounts } from 'meteor/accounts-base';

const firesSeed = () => ({
  collection: ActiveFiresCollection,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex) {
    return {
      ourid: {
        type: 'Point',
        coordinates: [
          149.751 + dataIndex,
          -10.021 + dataIndex
        ]
      },
      type: 'modis',
      lat: -10.021 + dataIndex,
      lon: 149.751 + dataIndex,
      updatedAt: Date('2018-05-02T16:11:04.617Z'),
      acq_date: '2018-05-02',
      acq_time: '00:05',
      scan: 1.5,
      track: 1.2,
      satellite: 'T',
      confidence: 57,
      version: '6.0NRT',
      frp: 7.8,
      daynight: 'D',
      brightness: 304.3,
      bright_t31: 283.4,
      when: Date('2018-05-01T22:05:00.000Z'),
      createdAt: Date('2018-05-02T16:11:04.617Z')
    };
  }
});

async function encAndDec(obj) {
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
}

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
      confidence: 'nominal',
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
    seeder(ActiveFiresCollection, firesSeed());
    const obj = ActiveFiresCollection.findOne();
    encAndDec(obj);
  });

  it('should decrypt node-red enc objects', async () => {
    const sealed = 'Fe26.2**750f04110aef0f20d1093aa3f2a54dac3d7d5cc86e864e2c7d71b0ead88bc5b9*rX653dosl4BiM2L4fmZiiA*xuKj8XojCaS38R6X1EXkXBWjOidpnB0EVgGbdod_4vACHSl1w61hgXkU6SOq8HdURakJKCyIqWrsrdGt6DI6bl1xgfZ4ejlRMV_Keu0-WV0BVqrxbw0NlMN9KPexRDsy15yZou4ExU1yE36PBsfZIYysUrIsXwiBz3D5KvDaW0BnAXZ4sUR5Kyvk8g75QQmBth_LVHaEWE_OMarQUXDvFZ33R2_vM_i89QSj-wzwG5v-lbYrimE_5SMhEngRJFjihtQ_LfQlkH0wrpe5SUIdNL-DzsRxswvY7RIuMKHVLWSy8So66PxCuVJKa-DGvclX7tj7NO9RgNidfqP8U0izTpoV7dJB44Bwi4NOwLKGwNO9NG7jt-KGb2P6FeLTJYq8Mt0qqNsYXWUMpuhgXlKc2SuKT0avh-kYdovFO3YztGg5dz_Asu5hGZtkzRG6oGrvZxU8j7VDDNSQLLHo67Skmqg5_0e6Bp0gqpz13bmCSVvM_IpOkJLIgkRkGAvFoPy-woBqWiBU3NICo0z9X35WJ8j2xFY5niidGPXkP_uo5JbpGkmLH1tL06UUqjXZ5GS7gVhi8ii0vZt5zgaM4z0g4Q**96aa408156b0952f0d90e7c6d3960c06595543ffcfd642274138631b51b03383*BRnu9clkqVeKeXfWVe8i_Dh6TgqstVgV9HafoiLKxks';
    const unsealed = await urlEnc.decrypt(sealed);
    // console.log(unsealed);
  });

  it('should encrypt and dcrypt Accounts hashes', async () => {
    const token = Accounts._generateStampedLoginToken();
    const obj = Accounts._hashStampedToken(token);
    console.log(obj);
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    const w = unsealed.when;
    unsealed.when = new Date(w);
    chai.expect(unsealed).to.deep.equal(obj);
  });

  // limit 0 for no limit and test everything (and increase timeout)
  it('should encrypt and dcrypt all collection objects', async () => {
    seeder(ActiveFiresCollection, firesSeed());
    ActiveFiresCollection.find({}, { limit: 1000 }).fetch().forEach((obj) => {
      encAndDec(obj);
    });
  }).timeout(5000);
});
