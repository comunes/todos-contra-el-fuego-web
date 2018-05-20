/* eslint-disable import/no-absolute-path */
import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import ravenLogger from '/imports/startup/server/ravenLogger';
import ActiveFires from '../ActiveFires';

const debug = 0;

const cleanProv = (prov, stringsToRemove) => {
  let lprov = prov;
  stringsToRemove.forEach((st) => {
    lprov = lprov.replace(st[0], st[1]);
  });
  return lprov;
};

const findFiresInRegion = (zone) => {
  const result = ActiveFires.find({
    ourid: {
      $geoWithin: {
        $geometry: zone.geometry
      }
    }
  });

  /*  console.log(`False positive total: ${falsePos.count()}`);
     console.log(`False positives: ${JSON.stringify(falsePos.fetch())}`); */
  return result;
};

export const countRealFires = (firesCursor) => {
  const realFires = [];
  firesCursor.forEach((fire) => {
    const union = firesUnion([fire]);
    const falsePos = whichAreFalsePositives(FalsePositives, union);
    const industries = whichAreFalsePositives(Industries, union);
    if (falsePos.count() === 0 && industries.count() === 0) {
      realFires.push(fire);
    }
  });
  // group fires
  const realUnion = firesUnion(realFires);
  const unionCount = realUnion[0] &&
                     realUnion[0].geometry &&
                     realUnion[0].geometry.coordinates ? realUnion[0].geometry.coordinates.length : 0;
  return unionCount;
};

const countFiresInRegions = (regions, stringsToRemove) => {
  let total = 0;
  const fireStats = {};

  regions.features.forEach((region) => {
    const regionName = cleanProv(region.properties.name, stringsToRemove);
    const regionCode = region.properties.iso_a2;
    if (debug) console.log(`${regionName} -----`);
    try {
      const fires = findFiresInRegion(region);
      // TODO Also check neighbour fires (when better implementation of that part)
      const initialCount = fires.count();
      if (initialCount > 0) {
        const unionCount = countRealFires(fires);
        if (debug) console.log(`${regionName} initial: ${initialCount}, union calc: ${unionCount}`);
        if (unionCount > 0) {
          total += unionCount;
          fireStats[regionName] = { count: unionCount, code: regionCode };
        }
      }
    } catch (e) {
      ravenLogger.log(e);
    }
  });
  return { total, fires: fireStats };
};

export default countFiresInRegions;
