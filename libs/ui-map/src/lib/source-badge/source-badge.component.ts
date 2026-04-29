import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import type { SourceBadgeKind } from './source-badge';

interface BadgeView {
  label: string;
  severity: 'success' | 'warn';
}

const BADGE_VIEWS: Record<SourceBadgeKind, BadgeView> = {
  gps: { label: 'Ubicación GPS', severity: 'success' },
  ip: { label: 'Ubicación aproximada (por IP)', severity: 'warn' },
};

@Component({
  selector: 'mapa-source-badge',
  standalone: true,
  imports: [Tag],
  template: `
    @if (view(); as v) {
      <p-tag [value]="v.label" [severity]="v.severity" />
    }
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceBadgeComponent {
  readonly source = input<SourceBadgeKind | null>(null);

  protected readonly view = computed<BadgeView | null>(() => {
    const source = this.source();
    return source ? BADGE_VIEWS[source] : null;
  });
}
