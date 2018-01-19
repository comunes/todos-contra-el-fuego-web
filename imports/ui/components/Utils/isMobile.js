import isMobile from 'ismobilejs';

// https://github.com/ReactTraining/react-router/issues/184
export const isHomeAndMobile = (window.location.pathname === '/' && isMobile.any);
export const isNotHomeAndMobile = !isHomeAndMobile;
export const isAnyMobile = isMobile.any;
