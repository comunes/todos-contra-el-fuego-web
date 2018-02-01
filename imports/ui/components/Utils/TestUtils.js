import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

export const testId = (id) => {
  if (Meteor.isDevelopment) {
    return id;
  }
  return Random.id;
};
