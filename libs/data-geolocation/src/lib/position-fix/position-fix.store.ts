import { Injectable, computed, inject, signal } from '@angular/core';
import { GeolocationService } from '../geolocation/geolocation.service';
import type {
  PositionFix,
  PositionFixStatus,
  PositionSource,
} from '../position-fix.types';

@Injectable({ providedIn: 'root' })
export class PositionFixStore {
  private readonly geolocation = inject(GeolocationService);

  private readonly statusSignal = signal<PositionFixStatus>('idle');
  private readonly fixSignal = signal<PositionFix | null>(null);
  private readonly errorSignal = signal<string | null>(null);

  readonly status = this.statusSignal.asReadonly();
  readonly fix = this.fixSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly source = computed<PositionSource | null>(
    () => this.fixSignal()?.source ?? null,
  );

  async load(): Promise<void> {
    if (this.statusSignal() === 'loading') {
      return;
    }
    this.statusSignal.set('loading');
    this.errorSignal.set(null);

    const permission = await this.geolocation.queryPermission();
    if (permission === 'granted' || permission === 'prompt') {
      const reading = await this.geolocation.getCurrentPosition();
      this.fixSignal.set({ ...reading, source: 'gps' });
      this.statusSignal.set('ready');
    }
  }
}
