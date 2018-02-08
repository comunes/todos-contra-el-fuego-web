import Leaflet from 'leaflet';

// http://leafletjs.com/reference-1.2.0.html#icon

export const fireIcon = new Leaflet.Icon({
  iconUrl: '/fire-marker.png',
  iconSize: [16, 24], // size of the icon
  iconAnchor: [8, 26] // point of the icon which will correspond to marker's location
  /* shadowUrl: require('../public/marker-shadow.png'), */
  /* shadowSize:   [50, 64], // size of the shadow */
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor */
});

export const industryIcon = new Leaflet.Icon({
  iconUrl: '/industry-marker.png',
  iconSize: [32, 37],
  iconAnchor: [16, 20]
});

export const nFireIcon = new Leaflet.Icon({
  iconUrl: '/n-fire-marker.png',
  iconSize: [16, 24], // size of the icon
  iconAnchor: [8, 26] // point of the icon which will correspond to marker's location
});

export const positionIcon = new Leaflet.Icon({
  iconUrl: '/your-position.png',
  iconSize: [50, 77], // size of the icon
  iconAnchor: [25, 82] // point of the icon which will correspond to marker's location
});

export const removeIcon = new Leaflet.Icon({
  iconUrl: '/remove-marker.png',
  iconSize: [24, 24], // size of the icon
  iconAnchor: [12, 12] // point of the icon which will correspond to marker's location
});
