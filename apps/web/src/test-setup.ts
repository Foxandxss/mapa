import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// jsdom does not implement createObjectURL; maplibre-gl evaluates it at import time.
if (typeof URL.createObjectURL === 'undefined') {
  Object.defineProperty(URL, 'createObjectURL', { value: () => '' });
}

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
