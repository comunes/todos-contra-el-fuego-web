/* eslint-disable import/no-absolute-path */

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import history from '/imports/ui/components/History/History';

export const location = new ReactiveVar(history.location.pathname);

if (Meteor.isClient) {
  history.listen((loc) => { // , action) => {
    // console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
    // console.log(`The last navigation action was ${action}`)
    location.set(loc.pathname);
  });
}

export const currentLocation = () => location.get();

export const currentLocationHref = () => {
  if (Meteor.isClient) {
    return window.location.href;
  }
  // FIXME
  return location.get();
};

export const isHome = () => currentLocation() === '/';
