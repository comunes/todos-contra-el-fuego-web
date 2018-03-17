/* eslint-disable import/no-absolute-path */
import { whichAreFalsePositives, firesUnion } from '/imports/api/FalsePositives/server/publications';
import FalsePositives from '/imports/api/FalsePositives/FalsePositives';
import Industries from '/imports/api/Industries/Industries';
import ActiveFires from '../ActiveFires';

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
      let count = fires.count();
      if (count > 0) {
        /* console.log(regionName);
         * console.log(count); */
        fires.forEach((fire) => {
          const union = firesUnion([fire]);
          const falsePos = whichAreFalsePositives(FalsePositives, union);
          const industries = whichAreFalsePositives(Industries, union);
          if (falsePos.count() > 0 || industries.count() > 0) {
            count -= 1;
          }
        });
        // console.log(count);
        if (count > 0) {
          total += count;
          fireStats[regionName] = count;
        }
      }
      // console.log(countFiresInRegion(prov));
    } catch (e) {
      console.log(e);
    }
  });
  return { total, fires: fireStats };
};

export default countFires;
