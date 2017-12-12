/* global L */
// https://stackoverflow.com/questions/35394577/leaflet-js-union-merge-circles
import union from '@turf/union';

export function unify(polyList) {
  let unionTemp;
  for (let i = 0; i < polyList.length; i += 1) {
    if (i === 0) {
      unionTemp = polyList[i].toGeoJSON();
    } else {
      unionTemp = union(unionTemp, polyList[i].toGeoJSON());
    }
  }
  return L.geoJson(unionTemp);
}
