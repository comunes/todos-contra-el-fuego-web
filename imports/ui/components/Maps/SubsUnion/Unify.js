import { check } from 'meteor/check';
import LGeo from 'leaflet-geodesy';
import tunion from '@turf/union';
import ttrunc from '@turf/truncate';

// https://stackoverflow.com/questions/35394577/leaflet-js-union-merge-circles
const truncOptions = { precision: 6, coordinates: 2 };

const unify = (polyList) => {
  let unionTemp;
  for (let i = 0; i < polyList.length; i += 1) {
    const pol = polyList[i].toGeoJSON();
    const cleanPol = ttrunc(pol, truncOptions);
    if (i === 0) {
      unionTemp = cleanPol;
    } else {
      unionTemp = ttrunc(tunion(unionTemp, cleanPol), truncOptions);
    }
  }
  return unionTemp;
};

const calcUnion = (subs, group, decorated) => {
  const unionGroup = group;
  const copts = {
    parts: 144
  };
  subs.forEach((osub) => {
    try {
      if (osub.location && osub.location.lat && osub.location.lon && osub.distance) {
        check(osub.location.lon, Number);
        check(osub.location.lat, Number);
        check(osub.distance, Number);
        const dsub = decorated(osub);
        const circle = LGeo.circle([dsub.location.lat, dsub.location.lon], dsub.distance * 1000, copts);
        circle.addTo(unionGroup);
      } else {
        console.info(`Wrong subscription ${JSON.stringify(osub)}`);
      }
    } catch (e) {
      console.error(e, `Wrong subscription trying to make union ${JSON.stringify(osub)}`);
    }
  });
  const unionJson = unify(unionGroup.getLayers());
  return [unionJson, unionGroup.getBounds()];
};

export default calcUnion;
