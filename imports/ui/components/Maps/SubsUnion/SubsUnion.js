/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */
/* global L */

import calcUnion from '/imports/ui/components/Maps/SubsUnion/Unify';

const subsUnion = (union, options) => {
  const color = options.color || '#145A32';
  const fillColor = options.fillColor || 'green';
  const opacity = options.options || 0.1;
  const interactive = options.interactive || false;

  if (options.subs) {
    const lmap = options.map.leafletElement;
    if (union) {
      lmap.removeLayer(union);
    }
    union = null;
    if (options.show) {
      if (options.fromServer) {
        // http://leafletjs.com/reference-1.3.0.html#geojson
        // We get the json from server side
        union = L.geoJson(JSON.parse(options.subs));
        union.setStyle({
          color, fillColor, fillOpacity: opacity, interactive
        });
        union.addTo(lmap);
        union.bringToBack();
        if (options.fit && options.bounds) {
          // console.log(options.bounds);
          const bounds = JSON.parse(options.bounds);
          options.map.leafletElement.fitBounds(L.latLngBounds(bounds._northEast, bounds._southWest));
        }
      } else if (options.subs.length > 0) {
        const unionGroup = new L.FeatureGroup();
        const result = calcUnion(options.subs, unionGroup, sub => sub);
        const unionJson = result[0];
        const bounds = result[1];

        union = L.geoJson(unionJson);
        union.setStyle({
          color, fillColor, fillOpacity: opacity, interactive
        });
        union.addTo(lmap);
        if (options.fit) {
          options.map.leafletElement.fitBounds(bounds);
        }
      }
    }
  }
  return union;
};

export default subsUnion;
