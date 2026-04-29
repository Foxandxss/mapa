export interface MapView {
  lat: number;
  lon: number;
  zoom: number;
}

export const DEFAULT_MAP_VIEW: MapView = {
  lat: 40.4,
  lon: -3.7,
  zoom: 5,
};
