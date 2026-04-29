import { Component } from '@angular/core';
import { MapPageComponent } from '@mapa/feature-map';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapPageComponent],
  template: `<mapa-map-page />`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {}
