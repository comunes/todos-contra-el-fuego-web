/* eslint-disable import/no-absolute-path */
import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import ActiveFires from '../ActiveFires';

const debug = 0;

const cleanProv = (prov, stringsToRemove) => {
  let lprov = prov;
  stringsToRemove.forEach((st) => {
    lprov = lprov.replace(st, '');
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

const countFires = (regions, stringsToRemove) => {
  let total = 0;
  const fireStats = {};

  regions.features.forEach((region) => {
    const regionName = cleanProv(region.properties.name, stringsToRemove);
    try {
      const fires = findFiresInRegion(region);
      // TODO Also check neighbour fires (when better implementation of that part)
      const initialCount = fires.count();
      let count = initialCount;
      if (count > 0) {
        const realFires = [];
        fires.forEach((fire) => {
          const union = firesUnion([fire]);
          const falsePos = whichAreFalsePositives(FalsePositives, union);
          const industries = whichAreFalsePositives(Industries, union);
          if (falsePos.count() === 0 && industries.count() === 0) {
            realFires.push(fire);
          } else {
            count -= 1;
          }
        });
        // group fires
        const realUnion = firesUnion(realFires);
        const unionCount = realUnion[0] &&
                           realUnion[0].geometry &&
                           realUnion[0].geometry.coordinates ? realUnion[0].geometry.coordinates.length : 0;
        if (debug) console.log(`${regionName} initial: ${initialCount}, first calc: ${count} union calc: ${unionCount}`);
        if (unionCount > 0) {
          total += unionCount;
          fireStats[regionName] = unionCount;
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
  return { total, fires: fireStats };
};

export default countFires;
