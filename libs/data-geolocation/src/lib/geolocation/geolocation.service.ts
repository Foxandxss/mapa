import { Injectable } from '@angular/core';

export interface GeolocationReading {
  lat: number;
  lon: number;
  accuracy: number;
}

export type GeolocationPermissionState = 'granted' | 'prompt' | 'denied';

export interface GeolocationOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  async queryPermission(): Promise<GeolocationPermissionState> {
    const permissions = navigator.permissions;
    if (!permissions || typeof permissions.query !== 'function') {
      return 'prompt';
    }
    const result = await permissions.query({ name: 'geolocation' });
    return result.state as GeolocationPermissionState;
  }

  getCurrentPosition(options: GeolocationOptions = {}): Promise<GeolocationReading> {
    return new Promise((resolve, reject) => {
      const geolocation = navigator.geolocation;
      if (!geolocation) {
        reject(new Error('Geolocation API not available'));
        return;
      }
      geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }),
        (error) => reject(error),
        {
          timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
          enableHighAccuracy: true,
        },
      );
    });
  }
}
