import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MapComponent as MaplibreMapComponent } from '@maplibre/ngx-maplibre-gl';
import { DEFAULT_MAP_VIEW, type MapView } from './map-view';

@Component({
  selector: 'mapa-map',
  standalone: true,
  imports: [MaplibreMapComponent],
  template: `
    <mgl-map
      [style]="styleUrl()"
      [zoom]="[view().zoom]"
      [center]="[view().lon, view().lat]"
    ></mgl-map>
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

  readonly styleUrl = computed(
    () => `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.maptilerKey()}`,
  );
}
