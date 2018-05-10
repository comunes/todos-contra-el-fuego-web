/* eslint-disable import/no-absolute-path */

import fs from 'fs';
import getFallbackLang from '/imports/modules/lang-fallback';

const as = f => `assets/app/${f}`;

export const getFileNameOfLang = (dir, fileName, ext, lang) => {
  const base = `${dir}/${fileName}`;
  const fallback = getFallbackLang(lang);
  let file = `${base}-${lang}.${ext}`;
  if (!fs.existsSync(as(file))) {
    // console.log(`Page '${fileName}' not found for '${lang}' lang`);
    file = `${base}-${fallback}.${ext}`;
    if (!fs.existsSync(as(file))) {
      // console.log(`Page '${fileName}' not found for '${fallback}' lang`);
      file = `${base}.${ext}`;
    }
  }
  return file;
};
