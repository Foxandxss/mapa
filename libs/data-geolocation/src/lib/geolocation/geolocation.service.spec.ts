import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;
  const originalGeolocation = navigator.geolocation;
  const originalPermissions = navigator.permissions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: originalPermissions,
      configurable: true,
    });
  });

  describe('queryPermission', () => {
    it('returns the state reported by navigator.permissions', async () => {
      Object.defineProperty(navigator, 'permissions', {
        value: { query: jest.fn().mockResolvedValue({ state: 'granted' }) },
        configurable: true,
      });

      await expect(service.queryPermission()).resolves.toBe('granted');
    });

    it('falls back to "prompt" when the Permissions API is missing', async () => {
      Object.defineProperty(navigator, 'permissions', {
        value: undefined,
        configurable: true,
      });

      await expect(service.queryPermission()).resolves.toBe('prompt');
    });
  });

  describe('getCurrentPosition', () => {
    it('resolves with lat/lon/accuracy when the browser returns a position', async () => {
      const getCurrentPosition = jest.fn(
        (success: PositionCallback) => {
          success({
            coords: {
              latitude: 40.4168,
              longitude: -3.7038,
              accuracy: 25,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            } as GeolocationCoordinates,
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
      );
      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition },
        configurable: true,
      });

      await expect(service.getCurrentPosition()).resolves.toEqual({
        lat: 40.4168,
        lon: -3.7038,
        accuracy: 25,
      });
    });

    it('passes the configured timeout to navigator.geolocation', async () => {
      const getCurrentPosition = jest.fn(
        (
          success: PositionCallback,
          _error: PositionErrorCallback,
          options?: PositionOptions,
        ) => {
          expect(options?.timeout).toBe(2000);
          success({
            coords: {
              latitude: 0,
              longitude: 0,
              accuracy: 1,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            } as GeolocationCoordinates,
            timestamp: 0,
          } as GeolocationPosition);
        },
      );
      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition },
        configurable: true,
      });

      await service.getCurrentPosition({ timeoutMs: 2000 });
      expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    });

    it('rejects when the browser returns an error', async () => {
      const error = { code: 1, message: 'denied' } as GeolocationPositionError;
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: (
            _success: PositionCallback,
            errorCb: PositionErrorCallback,
          ) => errorCb(error),
        },
        configurable: true,
      });

      await expect(service.getCurrentPosition()).rejects.toBe(error);
    });
  });
});
