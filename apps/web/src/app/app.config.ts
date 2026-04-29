import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideMapaFeatureMap } from '@mapa/feature-map';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    provideMapaFeatureMap(environment.maptilerApiKey),
  ],
};
