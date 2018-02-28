import isMobile from 'ismobilejs';
import { isHome } from './location';

// https://github.com/ReactTraining/react-router/issues/184
export const isHomeAndMobile = () => isHome() && isMobile.any;
export const isNotHomeAndMobile = () => !isHomeAndMobile();
export const isAnyMobile = isMobile.any;
// https://stackoverflow.com/questions/18625321/detect-webkit-browser-in-javascript
export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
