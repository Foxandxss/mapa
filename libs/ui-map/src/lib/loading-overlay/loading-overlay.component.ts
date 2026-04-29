import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'mapa-loading-overlay',
  standalone: true,
  imports: [ProgressSpinner],
  template: `
    <div class="overlay" role="status" aria-live="polite">
      <p-progressSpinner ariaLabel="Localizando" />
      <span class="label">Localizando…</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }
      .overlay {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.6);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      }
      .label {
        font-size: 1rem;
        color: #1f2937;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent {}
