import { MAPTILER_API_KEY } from '../tokens/maptiler-api-key.token';
import { provideMapaFeatureMap } from '../provide-mapa-feature-map';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('feature-map providers', () => {
  it('makes the MapTiler API key injectable', () => {
    TestBed.configureTestingModule({
      providers: [provideMapaFeatureMap('test-key')],
    });
    const injector = TestBed.inject(Injector);
    expect(injector.get(MAPTILER_API_KEY)).toBe('test-key');
  });
});
