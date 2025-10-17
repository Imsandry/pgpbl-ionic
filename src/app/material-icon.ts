import * as L from 'leaflet';

export const materialIcon = L.divIcon({
  html: `<i class="material-icons" style="font-size: 36px; color: #2196F3;">place</i>`,
  className: 'leaflet-material-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});
