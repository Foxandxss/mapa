import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  GeoJSONSourceComponent,
  LayerComponent,
  MapComponent as MaplibreMapComponent,
  MarkerComponent,
} from '@maplibre/ngx-maplibre-gl';
import type { Feature, Polygon } from 'geojson';
import type { LngLatLike } from 'maplibre-gl';
import { accuracyCirclePolygon } from './accuracy-circle';
import { DEFAULT_MAP_VIEW, type MapView } from './map-view';

const EMPTY_POLYGON: Feature<Polygon> = {
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [[]] },
  properties: {},
};

export interface MapMarker {
  lat: number;
  lon: number;
  accuracy: number;
}

const ACCURACY_SOURCE_ID = 'mapa-accuracy';

@Component({
  selector: 'mapa-map',
  standalone: true,
  imports: [
    MaplibreMapComponent,
    MarkerComponent,
    GeoJSONSourceComponent,
    LayerComponent,
  ],
  template: `
    <mgl-map
      [style]="styleUrl()"
      [zoom]="[view().zoom]"
      [center]="center()"
      movingMethod="flyTo"
    >
      @if (marker(); as m) {
        <mgl-marker [lngLat]="markerLngLat()" />
        <mgl-geojson-source [id]="accuracySourceId" [data]="accuracyData()" />
        <mgl-layer
          id="mapa-accuracy-fill"
          type="fill"
          [source]="accuracySourceId"
          [paint]="{ 'fill-color': '#3b82f6', 'fill-opacity': 0.15 }"
        />
        <mgl-layer
          id="mapa-accuracy-stroke"
          type="line"
          [source]="accuracySourceId"
          [paint]="{ 'line-color': '#2563eb', 'line-width': 2 }"
        />
      }
    </mgl-map>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
      }
      mgl-map {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  readonly maptilerKey = input.required<string>();
  readonly view = input<MapView>(DEFAULT_MAP_VIEW);
  readonly marker = input<MapMarker | null>(null);

  protected readonly accuracySourceId = ACCURACY_SOURCE_ID;

  protected readonly styleUrl = computed(
    () =>
      `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.maptilerKey()}`,
  );

  protected readonly center = computed<LngLatLike>(() => {
    const v = this.view();
    return [v.lon, v.lat];
  });

  protected readonly markerLngLat = computed<LngLatLike | undefined>(() => {
    const m = this.marker();
    return m ? [m.lon, m.lat] : undefined;
  });

  protected readonly accuracyData = computed<Feature<Polygon>>(() => {
    const m = this.marker();
    return m ? accuracyCirclePolygon(m.lat, m.lon, m.accuracy) : EMPTY_POLYGON;
  });
}
