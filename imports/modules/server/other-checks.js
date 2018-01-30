import { check, Match } from 'meteor/check';

export const validZoom = Match.Where((zoom) => {
  // http://wiki.openstreetmap.org/wiki/Zoom_levels
  check(zoom, Number);
  return zoom >= 0 && zoom <= 19;
});

// https://github.com/3stack-software/meteor-match-library
export function NumberBetween(min, max) {
  return Match.Where((x) => {
    check(x, Number);
    return min <= x && x <= max;
  });
}

export function NullOr(type) {
  return Match.Where((x) => {
    if (x === null) {
      return true;
    }
    check(x, type);
    return true;
  });
}
