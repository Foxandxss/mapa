import { DEFAULT_MAP_VIEW, type MapView } from './map-view';

describe('ui-map smoke', () => {
  it('exposes a default map view centered on Spain at zoom 5', () => {
    const view: MapView = DEFAULT_MAP_VIEW;
    expect(view).toEqual({ lat: 40.4, lon: -3.7, zoom: 5 });
  });
});
