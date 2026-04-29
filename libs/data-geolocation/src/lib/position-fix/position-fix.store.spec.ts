import { TestBed } from '@angular/core/testing';
import { GeolocationService } from '../geolocation/geolocation.service';
import { PositionFixStore } from './position-fix.store';

describe('PositionFixStore', () => {
  function setup(geolocation: Partial<GeolocationService>) {
    TestBed.configureTestingModule({
      providers: [
        { provide: GeolocationService, useValue: geolocation },
      ],
    });
    return TestBed.inject(PositionFixStore);
  }

  it('starts in idle with no fix, source, or error', () => {
    const store = setup({
      queryPermission: jest.fn(),
      getCurrentPosition: jest.fn(),
    });

    expect(store.status()).toBe('idle');
    expect(store.fix()).toBeNull();
    expect(store.source()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('granted+ok: transitions idle → loading → ready with source=gps', async () => {
    let resolvePosition: (value: { lat: number; lon: number; accuracy: number }) => void = () => undefined;
    const positionPromise = new Promise<{ lat: number; lon: number; accuracy: number }>(
      (resolve) => {
        resolvePosition = resolve;
      },
    );

    const store = setup({
      queryPermission: jest.fn().mockResolvedValue('granted'),
      getCurrentPosition: jest.fn().mockReturnValue(positionPromise),
    });

    const loadPromise = store.load();

    // Yield once so the awaited queryPermission settles and the store flips to loading.
    await Promise.resolve();
    await Promise.resolve();
    expect(store.status()).toBe('loading');
    expect(store.fix()).toBeNull();

    resolvePosition({ lat: 40.4168, lon: -3.7038, accuracy: 25 });
    await loadPromise;

    expect(store.status()).toBe('ready');
    expect(store.fix()).toEqual({
      lat: 40.4168,
      lon: -3.7038,
      accuracy: 25,
      source: 'gps',
    });
    expect(store.source()).toBe('gps');
    expect(store.error()).toBeNull();
  });

  it('treats permission "prompt" as a green light to call getCurrentPosition', async () => {
    const store = setup({
      queryPermission: jest.fn().mockResolvedValue('prompt'),
      getCurrentPosition: jest
        .fn()
        .mockResolvedValue({ lat: 1, lon: 2, accuracy: 3 }),
    });

    await store.load();

    expect(store.status()).toBe('ready');
    expect(store.fix()).toEqual({ lat: 1, lon: 2, accuracy: 3, source: 'gps' });
  });

  it('ignores re-entrant load() calls while already loading', async () => {
    const queryPermission = jest.fn().mockResolvedValue('granted');
    const getCurrentPosition = jest
      .fn()
      .mockResolvedValue({ lat: 0, lon: 0, accuracy: 1 });

    const store = setup({ queryPermission, getCurrentPosition });

    const first = store.load();
    const second = store.load();
    await Promise.all([first, second]);

    expect(queryPermission).toHaveBeenCalledTimes(1);
    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
  });
});
