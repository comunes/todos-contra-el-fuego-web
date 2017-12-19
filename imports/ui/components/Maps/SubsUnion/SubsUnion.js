/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */
/* global L */

import { Map } from 'react-leaflet';
import LGeo from 'leaflet-geodesy';
import tunion from '@turf/union';
import { check, Match } from 'meteor/check';

// https://stackoverflow.com/questions/35394577/leaflet-js-union-merge-circles

function unify(polyList) {
  let unionTemp;
  for (let i = 0; i < polyList.length; i += 1) {
    if (i === 0) {
      unionTemp = polyList[i].toGeoJSON();
    } else {
      unionTemp = tunion(unionTemp, polyList[i].toGeoJSON());
    }
  }
  return unionTemp;
}

const subsUnion = (union, options) => {
  // check(union, Match.Optional(Object));
  check(options, {
    map: Map,
    show: Boolean,
    subs: [Object],
    color: Match.Optional(String),
    fillcolor: Match.Optional(String),
    opacity: Match.Optional(Number),
    fit: Boolean
  });

  const color = options.color || '#145A32';
  const fillColor = options.fillColor || 'green';
  const opacity = options.options || 0.1;

  if (options.subs.length > 0) {
    const lmap = options.map.leafletElement;
    // http://leafletjs.com/reference-1.2.0.html#layergroup
    // FeatureGroup has getBounds
    const unionGroup = new L.FeatureGroup();

    if (union) {
      lmap.removeLayer(union);
    }
    union = null;

    if (options.show) {
      // http://leafletjs.com/reference-1.2.0.html#path
      const copts = {
        parts: 144
      };
      options.subs.forEach((sub) => {
        const circle = LGeo.circle([sub.location.lat, sub.location.lon], sub.distance * 1000, copts);
        circle.addTo(unionGroup);
      });
      const unionJson = unify(unionGroup.getLayers());
      union = L.geoJson(unionJson);
      union.setStyle({
        color,
        fillColor,
        fillOpacity: opacity
      });
      union.addTo(lmap);
      if (options.fit) {
        options.map.leafletElement.fitBounds(unionGroup.getBounds());
      }
      return union;
    }
  }
  return union;
};

export default subsUnion;
