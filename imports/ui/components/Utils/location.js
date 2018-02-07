import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

export const location = new ReactiveVar();

export const currentLocation = () => {
  if (Meteor.isClient) {
    return window.location.pathname;
  }
  return location.get();
};

export const isHome = () => currentLocation() === '/';
