import { calcUnion as calcUnionWoBounds } from 'map-common-utils';

const calcUnion = (L, subs, decorated, typeCircle) => {
  const unionJson = calcUnionWoBounds(subs, decorated, typeCircle);
  // return [unionJson, L.geoJSON(unionJson).getBounds()];
  return [unionJson, unionJson === null ? null : L.geoJSON(unionJson).getBounds()];
};

export default calcUnion;
