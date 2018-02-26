const getFallbackLang = (lang) => {
  if (lang && (lang === 'ast' || lang === 'gl' || lang === 'eu' || lang === 'ca' || lang.match(/^es-/))) {
    return 'es';
  }
  return 'en';
};

export default getFallbackLang;
