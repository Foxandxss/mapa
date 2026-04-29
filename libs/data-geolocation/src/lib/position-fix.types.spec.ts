import type { PositionFix, PositionFixStatus, PositionSource } from './position-fix.types';

describe('PositionFix types', () => {
  it('exposes the canonical Position Fix shape', () => {
    const fix: PositionFix = {
      lat: 40.4,
      lon: -3.7,
      accuracy: 50,
      source: 'gps',
    };

    const source: PositionSource = fix.source;
    const status: PositionFixStatus = 'ready';

    expect(fix.source).toBe('gps');
    expect(source).toBe('gps');
    expect(status).toBe('ready');
  });
});
