/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import ActiveFiresUnion from '/imports/api/ActiveFiresUnion/ActiveFiresUnion';

const centerid = { type: 'Point', coordinates: [-5.905956029891968, 43.55727622097011] };
const shape = { type: 'Polygon', coordinates: [[[-5.9084, 43.5558], [-5.906, 43.5558], [-5.906, 43.5566], [-5.9036, 43.5566], [-5.9036, 43.5583], [-5.9061, 43.5583], [-5.9061, 43.558], [-5.9084, 43.558], [-5.9084, 43.5558]]] };
const fireUnion = { centerid, shape, when: Date('2018-05-02T16:11:04.617Z') };

describe('activeFireUnion insert', () => {
  it('should insert fire union', () => {
    // Remove previous test register
    const alreadyInserted = ActiveFiresUnion.findOne({ centerid });
    if (alreadyInserted) {
      ActiveFiresUnion.remove(alreadyInserted._id);
    }

    const insertedId = ActiveFiresUnion.insert(fireUnion);
    ActiveFiresUnion.schema.validate(fireUnion);

    const inserted = ActiveFiresUnion.findOne(insertedId);
    delete inserted._id;
    chai.expect(fireUnion).to.deep.equal(inserted);
    ActiveFiresUnion.remove(insertedId);
    chai.expect(ActiveFiresUnion.find({ _id: inserted }).count()).equal(0);
  });
});
