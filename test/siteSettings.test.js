/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import SiteSettingsTypes from '/imports/api/SiteSettings/SiteSettingsTypes';

const setting = {
  name: 'site-test',
  value: 'Some value',
  description: 'Some description',
  type: 'string'
};

describe('site settings store', () => {
  it('should get settingstypes', () => {
    chai.expect(SiteSettingsTypes.string.value.type).equal(String);
  });

  it('should insert settings', () => {
    const id = SiteSettings.insert(setting);
    SiteSettings.getSchema(setting.type).validate(setting);

    const inserted = SiteSettings.findOne(id);
    delete inserted._id;
    chai.expect(setting).to.deep.equal(inserted);
    SiteSettings.remove(id);
    chai.expect(SiteSettings.find({ _id: inserted }).count()).equal(0);
  });

  it('should not insert twice', () => {
    const id = SiteSettings.insert(setting);
    // If this fails manual check that the setting it's not already in the db.
    chai.expect(() => {
      SiteSettings.insert(setting);
    }).to.throw('E11000 duplicate key error collection: fuegos.siteSettings index: name_1 dup key: { : "site-test" }');
    const inserted = SiteSettings.find(id).count();
    chai.expect(inserted).equal(1);
    SiteSettings.remove(id);
    chai.expect(SiteSettings.find({ _id: inserted }).count()).equal(0);
  });

  it('should fail validation', () => {
    chai.expect(() => {
      SiteSettings.getSchema('boolean').validate(setting);
    }).to.throw('Value must be of type Boolean');
  });
});
