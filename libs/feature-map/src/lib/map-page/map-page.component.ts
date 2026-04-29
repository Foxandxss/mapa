import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { PositionFixStore } from '@mapa/data-geolocation';
import {
  DEFAULT_MAP_VIEW,
  LoadingOverlayComponent,
  MapComponent,
  type MapMarker,
  type MapView,
  SourceBadgeComponent,
} from '@mapa/ui-map';
import { MAPTILER_API_KEY } from '../tokens/maptiler-api-key.token';

const GPS_ZOOM = 16;

@Component({
  selector: 'mapa-map-page',
  standalone: true,
  imports: [MapComponent, SourceBadgeComponent, LoadingOverlayComponent],
  template: `
    <mapa-map
      [maptilerKey]="maptilerKey"
      [view]="view()"
      [marker]="marker()"
    />
    <mapa-source-badge class="badge" [source]="store.source()" />
    @if (store.status() === 'loading') {
      <mapa-loading-overlay />
    }
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
      }
      .badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 2;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements OnInit {
  protected readonly maptilerKey = inject(MAPTILER_API_KEY);
  protected readonly store = inject(PositionFixStore);

  protected readonly marker = computed<MapMarker | null>(() => {
    const fix = this.store.fix();
    return fix
      ? { lat: fix.lat, lon: fix.lon, accuracy: fix.accuracy }
      : null;
  });

  protected readonly view = computed<MapView>(() => {
    const fix = this.store.fix();
    if (fix && fix.source === 'gps') {
      return { lat: fix.lat, lon: fix.lon, zoom: GPS_ZOOM };
    }
    return DEFAULT_MAP_VIEW;
  });

  ngOnInit(): void {
    void this.store.load();
  }
}
