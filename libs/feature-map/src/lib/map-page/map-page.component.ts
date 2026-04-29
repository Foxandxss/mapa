import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MapComponent } from '@mapa/ui-map';
import { MAPTILER_API_KEY } from '../tokens/maptiler-api-key.token';

@Component({
  selector: 'mapa-map-page',
  standalone: true,
  imports: [MapComponent],
  template: `<mapa-map [maptilerKey]="maptilerKey" />`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent {
  protected readonly maptilerKey = inject(MAPTILER_API_KEY);
}
