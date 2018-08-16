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
  it('should encrypt and dcrypt basic objects', async (done) => {
    const obj = { lat: 2 };
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    chai.expect(unsealed).to.deep.equal(obj);
    done();
  });

  it('should encrypt and dcrypt objects with date', async (done) => {
    const obj = { lat: 40.234503, lon: -3.350386, when: (new Date()).toString() };
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    chai.expect(unsealed).to.deep.equal(obj);
    done();
  });

  it('should encrypt complete objects', async (done) => {
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
    chai.expect(sealed).to.not.include('/');
    chai.expect(sealed).to.not.include('%');
    done();
  });

  // This fails because Date is return as String (not as Date) and because _id
  it('should encrypt and dcrypt collection objects', async (done) => {
    seeder(ActiveFiresCollection, firesSeed());
    const obj = ActiveFiresCollection.findOne();
    encAndDec(obj);
    done();
  });

  it('should decrypt node-red enc objects', async () => {
    const sealed = 'Fe26.2**7ae64199b871901d16a6ba031198c57b43b4a9231e15b851ff80014a8de230ca*RkB3_Uu_oJnTefyzB-Ocqg*2Z9rXYf--GxLJnYESHvdK5rC6lOMlSbMJ6YQyR2Mgpl57iBYopAHPWRLNTBgNkbUHFYa0IlEjdyeEz5VvLDtVvlSr1Sam-Cx8GUai4mharZO5-Wkze0dTr7M56WofSC9jpkv3kANrpsrit3HASE_E-5Z1JVYQVQqehw-VbSZTorrYj0GCJiAgXE5I0iY4boXRDYCv7fm_pzcuAbHlnNkKT1GbMFEPjyVViP4mVMRI5PDUhcWb0f62goMX4UnYLZXum4oYOIr84DG8AxqIdW2L94yslt0EZkD3yVhvKEGoauMpy6ry2illpSgaMaj4sU3AKWIjfAsJXvM6bHwbNh6G1_BJfCapuu3KijBBQPQMAnhYuwLAlY56WN-Y2efNIBJkp__kO6ak2nFqu8PufpxE-cv0uW7x6GWUtCpnFO2SeUJWVVMddUgJjLiM8Hkdl1v9huB0WdIvsoPEV0ZOwHZaC3jtdKFSO7Xe6LdqTXjXmdBMwtOv-HefyaB8LnEN6dAeKWwJuDu7g03QFTryDIiuwtpQ8mcLWTJGHcxoaluNhUESOBULkWSv_E1vOM1_fFv**1e41101b27c5da58bc11177448e91d88d7801bf911088a895844db0c542dfa7c*dPlOhtXJcyR47ezuL7CEgC2Z8d6C1asNOiqZmhD5TXY';
    const unsealed = await urlEnc.decrypt(sealed);
    // console.log(unsealed);
  });

  it('should encrypt and dcrypt Accounts hashes', async (done) => {
    const token = Accounts._generateStampedLoginToken();
    const obj = Accounts._hashStampedToken(token);
    console.log(obj);
    const sealed = await urlEnc.encrypt(obj);
    const unsealed = await urlEnc.decrypt(sealed);
    const w = unsealed.when;
    unsealed.when = new Date(w);
    chai.expect(unsealed).to.deep.equal(obj);
    done();
  });

  // limit 0 for no limit and test everything (and increase timeout)
  it('should encrypt and dcrypt all collection objects', async (done) => {
    seeder(ActiveFiresCollection, firesSeed());
    ActiveFiresCollection.find({}, { limit: 1000 }).fetch().forEach((obj) => {
      encAndDec(obj);
    });
    done();
  }).timeout(5000);
});
