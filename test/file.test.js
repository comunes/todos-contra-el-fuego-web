/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable import/no-absolute-path */

import { chai } from 'meteor/practicalmeteor:chai';
import { getFileNameOfLang } from '/imports/api/Utility/server/files.js';

describe('get file of page', () => {
  it('lang es retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'es'));
  });

  it('lang en retrieve en', async () => {
    chai.expect('pages/about-en.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'en'));
  });

  it('lang gl retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'gl'));
  });

  it('lang ast retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'gl'));
  });

  it('lang eu retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'eu'));
  });

  it('lang ca retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'ca'));
  });

  it('lang es-PE retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'es-PE'));
  });

  it('lang es_PE retrieve es', async () => {
    chai.expect('pages/about-es.md').to.deep.equal(getFileNameOfLang('pages', 'about', 'md', 'es_PE'));
  });
});
