import { check } from 'meteor/check';
import tunion from '@turf/union';
import ttrunc from '@turf/truncate';
import { rectangleAround } from 'map-common-utils';
import tcircle from '@turf/circle';

 // https://stackoverflow.com/questions/35394577/leaflet-js-union-merge-circles
const truncOptions = { precision: 6, coordinates: 2 };

const unify = (polyList) => {
  let unionTemp;
  for (let i = 0; i < polyList.length; i += 1) {
    const pol = polyList[i];
    const cleanPol = ttrunc(pol, truncOptions);
    if (i === 0) {
      unionTemp = cleanPol;
    } else {
      unionTemp = ttrunc(tunion(unionTemp, cleanPol), truncOptions);
    }
  }
  return unionTemp;
};

const calcUnion = (L, subs, decorated, typeCircle) => {
  const unionGroup = [];
  const doCircle = (typeof typeCircle !== 'undefined') ? typeCircle : true;
  subs.forEach((osub) => {
    try {
      if (osub.location && osub.location.lat && osub.location.lon && osub.distance) {
        check(osub.location.lon, Number);
        check(osub.location.lat, Number);
        check(osub.distance, Number);
        const dsub = decorated(osub);
        const jsonPolygon = doCircle ?
                       tcircle(
                         [dsub.location.lon, dsub.location.lat], dsub.distance,
                         { units: 'kilometers', steps: 144 }
                       ) :
                       rectangleAround(
                         { lon: dsub.location.lon, lat: dsub.location.lat },
                         dsub.distance,
                         (typeof dsub.distanceY !== 'undefined') ? dsub.distanceY : dsub.distance
                       );
        unionGroup.push(jsonPolygon);
      } else {
        console.info(`Wrong element to do union ${JSON.stringify(osub)}`);
      }
    } catch (e) {
      console.error(e, `Wrong element trying to make union ${JSON.stringify(osub)}`);
    }
  });
  const unionJson = unify(unionGroup);
  return [unionJson, L.geoJSON(unionJson).getBounds()];
};

export default calcUnion;
