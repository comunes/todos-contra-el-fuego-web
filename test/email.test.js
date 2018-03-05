/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import { subjectTruncate } from '/imports/modules/server/send-email';

describe('check email utilities', () => {
  it('small words', async () => {
    chai.expect('something').equal(subjectTruncate.apply('something', [50, true]));
  });

  it('big sentences', async () => {
    chai.expect('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget sed.')
      .equal(subjectTruncate.apply('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget sed.'));
  });

  it('big sentences space break', async () => {
    chai.expect('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi...')
      .equal(subjectTruncate.apply('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mollis cras amet.'));
  });

  it('big sentences no break', async () => {
    chai.expect('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mollis...')
      .equal(subjectTruncate.apply('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mollis cras amet.', [70, false]));
  });
});
