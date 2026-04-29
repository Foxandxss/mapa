import { render, screen } from '@testing-library/angular';
import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
  it('shows the "Localizando…" label inside a status region', async () => {
    await render(LoadingOverlayComponent);

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status.textContent).toContain('Localizando…');
  });
});
