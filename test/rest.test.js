/* eslint-disable import/no-absolute-path */
/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { chai } from 'meteor/practicalmeteor:chai';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const testPort = process.env.TEST_PORT;
function url(path) {
  return `http://127.0.0.1:${testPort}/${path}`;
}

describe('basic api v1 returns', () => {
  it('should return uptime', async done =>
    HTTP.get(url('api/v1/status/uptime'), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).to.equal(200);
      chai.expect(typeof result.data.ms).to.equal('number');
      done();
    }));

  it('should return last-fire', async done =>
    HTTP.get(url('api/v1/status/active-fires-count'), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(200);
      chai.expect(typeof result.data.total).to.equal('number');
      done();
    }));

  const token = Meteor.settings.private.internalApiToken;

  it('should return fires in some location', async done =>
    HTTP.get(url(`api/v1/fires-in/${token}/38.736946/-9.142685/100`), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(200);
      chai.expect(typeof result.data.total).to.equal('number');
      chai.expect(typeof result.data.real).to.equal('number');
      done();
    }));

  it('should return full fires in some location', async done =>
    HTTP.get(url(`api/v1/fires-in-full/${token}/38.736946/-9.142685/100`), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(200);
      chai.expect(typeof result.data.total).to.equal('number');
      chai.expect(typeof result.data.real).to.equal('number');
      chai.expect(typeof result.data.falsePos).to.equal('object');
      chai.expect(typeof result.data.industries).to.equal('object');
      chai.expect(typeof result.data.fires).to.equal('object');
      done();
    }));

  it('should not return full fires with some wrong token', async done =>
    HTTP.get(url('api/v1/fires-in-full/token/38.736946/-9.142685/100'), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(401);
      done();
    }));

  it('should not return fires with some wrong token', async done =>
    HTTP.get(url('api/v1/fires-in/token/38.736946/-9.142685/100'), {
      data: {
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(401);
      done();
    }));

  it('should not return fires with some wrong distance', async done =>
    HTTP.get(url(`api/v1/fires-in-full/${token}/38.736946/-9.142685/1100`), (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(400);
      done();
    }));

  const mobileToken = 'user-mobile-firebase-token';
  let testUserId;
  let returnedSubsId;
  const objId = new Meteor.Collection.ObjectID();

  it('should create mobile users', async (done) => {
    // this are removed in the test database but we are testing in dev/ci database

    // Delete the test account if it's still present
    // Meteor.users.remove({ fireBaseToken: mobileToken });

    HTTP.post(url('api/v1/mobile/users'), {
      data: {
        token,
        mobileToken,
        lang: 'en'
      }
    }, (error, result) => {
      chai.expect(error, null);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      chai.expect(result.statusCode).equal(200);
      chai.expect(jsendResult.data.upsertResult.numberAffected).to.equal(1);
      chai.expect(jsendResult.data.mobileToken).to.equal(mobileToken);
      chai.expect(jsendResult.data.lang).to.equal('en');
      chai.expect(typeof jsendResult.data.username).to.equal('string');
      testUserId = jsendResult.data.userId;
      chai.expect(typeof testUserId).to.equal('string');
      done();
    });
  });

  it('should not create mobile users with wrong token', async (done) => {
    // this are removed in the test database but we are testing in dev/ci database
    // Delete the test account if it's still present
    // Meteor.users.remove({ fireBaseToken: mobileToken });

    HTTP.post(url('api/v1/mobile/users'), {
      data: {
        token: 'wrong token',
        mobileToken,
        lang: 'en'
      }
    }, (error, result) => {
      chai.expect(error, null);
      chai.expect(result.statusCode).equal(401);
      done();
    });
  });

  function addSubs(done) {
    // this are removed in the test database but we are testing in dev/ci database
    // Remove previous subs of this user
    // Subscriptions.remove({ owner: testUserId });
    // chai.expect(Subscriptions.find({ owner: testUserId }).count()).to.equal(0);
    HTTP.post(url('api/v1/mobile/subscriptions'), {
      data: {
        token,
        mobileToken,
        id: objId._str,
        lat: 3.106111,
        lon: 53.5775,
        distance: 100
      }
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 200) console.log(result);
      chai.expect(result.statusCode).equal(200);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      returnedSubsId = jsendResult.data.subsId;
      chai.expect(returnedSubsId.toString()).equal(objId._str);
      done();
    });
  }

  it('should create mobile user subscriptions', async (done) => {
    addSubs(done);
  });

  it('should not create mobile user subscriptions with wrong token', async (done) => {
    HTTP.post(url('api/v1/mobile/subscriptions'), {
      data: {
        token: 'wrongOne',
        mobileToken,
        id: objId._str,
        lat: 3.106111,
        lon: 53.5775,
        distance: 100
      }
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 401) console.log(result);
      chai.expect(result.statusCode).equal(401);
      done();
    });
  });

  it('should get all mobile user subscriptions', async (done) => {
    HTTP.get(url(`api/v1/mobile/subscriptions/all/${token}/${mobileToken}`), {
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 200) console.log(result);
      chai.expect(result.statusCode).equal(200);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      chai.expect(typeof jsendResult.data.subscriptions).to.equal('object');
      chai.expect(typeof jsendResult.data.count).to.equal('number');
      if (jsendResult.data.count !== 1) console.log(result);
      chai.expect(jsendResult.data.count).to.equal(1);
      // console.log(JSON.stringify(jsendResult.data.subscriptions));
      done();
    });
  });


  it('should remove mobile user subscriptions', async (done) => {
    // this are removed in the test database but we are testing in dev/ci database

    HTTP.del(url(`api/v1/mobile/subscriptions/${token}/${mobileToken}/${returnedSubsId}`), {
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 200) console.log(result);
      chai.expect(result.statusCode).equal(200);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      done();
    });
  });

  it('should get all mobile user subscriptions after deletion', async (done) => {
    HTTP.get(url(`api/v1/mobile/subscriptions/all/${token}/${mobileToken}`), {
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 200) console.log(result);
      chai.expect(result.statusCode).equal(200);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      chai.expect(typeof jsendResult.data.subscriptions).to.equal('object');
      chai.expect(typeof jsendResult.data.count).to.equal('number');
      if (jsendResult.data.count !== 0) console.log(result);
      chai.expect(jsendResult.data.count).to.equal(0);
      // console.log(JSON.stringify(jsendResult.data.subscriptions));
      done();
    });
  });

  it('should not remove mobile user subscriptions with wrong token', async (done) => {
    HTTP.del(url(`api/v1/mobile/subscriptions/wrongOne/${mobileToken}/${returnedSubsId}`), {
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 401) console.log(result);
      chai.expect(result.statusCode).equal(401);
      done();
    });
  });

  it('should not get mobile user subscriptions with wrong token', async (done) => {
    HTTP.get(url(`api/v1/mobile/subscriptions/all/wrongOne/${mobileToken}`), {
    }, (error, result) => {
      chai.expect(error, null);
      if (result.statusCode !== 401) console.log(result);
      chai.expect(result.statusCode).equal(401);
      done();
    });
  });

  it('should get all mobile user subscriptions', async (done) => {
    HTTP.get(url(`api/v1/mobile/subscriptions/all/${token}/${mobileToken}`), {
    }, (error, result) => {
      chai.expect(error, null);
      // console.log(result);
      if (result.statusCode !== 200) console.log(result);
      chai.expect(result.statusCode).equal(200);
      const jsendResult = result.data;
      chai.expect(jsendResult.status).equal('success');
      chai.expect(typeof jsendResult.data.subscriptions).to.equal('object');
      chai.expect(typeof jsendResult.data.count).to.equal('number');
      if (jsendResult.data.count !== 0) console.log(result);
      chai.expect(jsendResult.data.count).to.equal(0);
      done();
    });
  });

  it('should del all mobile user subscriptions', async (done) => {
    // Add subs
    addSubs(() => {
      HTTP.del(url(`api/v1/mobile/subscriptions/all/${token}/${mobileToken}`), {
      }, (error, result) => {
        chai.expect(error, null);
        if (result.statusCode !== 200) console.log(result);
        chai.expect(result.statusCode).equal(200);
        const jsendResult = result.data;
        chai.expect(jsendResult.status).equal('success');
        chai.expect(typeof jsendResult.data.count).to.equal('number');
        chai.expect(jsendResult.data.count).to.be.at.most(1);
        done();
      });
    });
  });
});
