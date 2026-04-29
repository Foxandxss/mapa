import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { MAPTILER_API_KEY } from './tokens/maptiler-api-key.token';

export function provideMapaFeatureMap(maptilerKey: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MAPTILER_API_KEY, useValue: maptilerKey },
  ]);
}
