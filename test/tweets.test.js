/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import { composeIberiaTweet } from '/imports/api/ActiveFires/server/tweetFiresInZone';

describe('compose tweets of fires', () => {
  it('No fires', async () => {
    chai.expect('').to.deep.equal(composeIberiaTweet(0, { }));
  });

  it('a fire in a zone', async () => {
    chai.expect('Un #fuego activo en #Asturias').to.deep.equal(composeIberiaTweet(1, { Asturias: 1 }));
  });

  it('some fires in a zone', async () => {
    chai.expect('4 #fuegos activos en #Asturias').to.deep.equal(composeIberiaTweet(4, { Asturias: 4 }));
  });

  it('some fires in two zones', async () => {
    chai.expect('Un #fuego activo en #Asturias y otros 4 en #Madrid').to.deep.equal(composeIberiaTweet(5, { Asturias: 1, Madrid: 4 }));
  });

  it('some fires in some zones', async () => {
    chai.expect('3 #fuegos activos en #Catalunya, otro en #Asturias y otros 4 en #Madrid').to.deep.equal(composeIberiaTweet(8, { Catalunya: 3, Asturias: 1, Madrid: 4 }));
  });

  it('other fires in some zones', async () => {
    chai.expect('Un #fuego activo en #Catalunya, otro en #Asturias y otros 4 en #Madrid').to.deep.equal(composeIberiaTweet(6, { Catalunya: 1, Asturias: 1, Madrid: 4 }));
  });

  it('other fires in two zones', async () => {
    chai.expect('Un #fuego activo en #Catalunya y otro en #Asturias').to.deep.equal(composeIberiaTweet(2, { Catalunya: 1, Asturias: 1 }));
  });

  it('many fires in many zones', async () => {
    chai.expect('3 #fuegos activos en #Cataluña, otro en #Cantabria, otros 4 en #Andalucia, otro en #Galicia y otros 2 en #Madrid').to.deep.equal(composeIberiaTweet(11, {
      Cataluña: 3, Cantabria: 1, Andalucia: 4, Galicia: 1, Madrid: 2
    }));
  });
});
