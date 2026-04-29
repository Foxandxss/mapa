export type PositionSource = 'gps' | 'ip';

export type PositionFixStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PositionFix {
  lat: number;
  lon: number;
  accuracy: number;
  source: PositionSource;
}
