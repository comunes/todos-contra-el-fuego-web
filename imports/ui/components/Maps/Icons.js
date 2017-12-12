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

export const nFireIcon = new Leaflet.Icon({
  iconUrl: '/n-fire-marker.png',
  iconSize: [16, 24], // size of the icon
  iconAnchor: [8, 26] // point of the icon which will correspond to marker's location
  /* shadowUrl: require('../public/marker-shadow.png'), */
  /* shadowSize:   [50, 64], // size of the shadow */
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor */
});

export const positionIcon = new Leaflet.Icon({
  iconUrl: '/your-position.png',
  iconSize: [50, 77], // size of the icon
  iconAnchor: [25, 82] // point of the icon which will correspond to marker's location
  /* shadowSize:   [50, 64], // size of the shadow */
  /* shadowUrl: require('../public/marker-shadow.png'), */
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor */
});
