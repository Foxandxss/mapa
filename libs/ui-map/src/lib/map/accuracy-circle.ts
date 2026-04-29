import type { Feature, Polygon } from 'geojson';

const EARTH_RADIUS_METERS = 6_378_137;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export function accuracyCirclePolygon(
  lat: number,
  lon: number,
  radiusMeters: number,
  points = 64,
): Feature<Polygon> {
  const coords: [number, number][] = [];
  const cosLat = Math.cos(lat * DEG_TO_RAD);
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dxMeters = radiusMeters * Math.cos(angle);
    const dyMeters = radiusMeters * Math.sin(angle);
    const dLon = (dxMeters / EARTH_RADIUS_METERS) * RAD_TO_DEG / cosLat;
    const dLat = (dyMeters / EARTH_RADIUS_METERS) * RAD_TO_DEG;
    coords.push([lon + dLon, lat + dLat]);
  }
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {},
  };
}
