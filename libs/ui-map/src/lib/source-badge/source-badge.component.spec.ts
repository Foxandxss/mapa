import { render, screen } from '@testing-library/angular';
import { SourceBadgeComponent } from './source-badge.component';

describe('SourceBadgeComponent', () => {
  it('renders nothing when no source is provided', async () => {
    const { container } = await render(SourceBadgeComponent);
    expect(container.querySelector('p-tag')).toBeNull();
  });

  it('renders "Ubicación GPS" with success severity for source=gps', async () => {
    await render(SourceBadgeComponent, { inputs: { source: 'gps' } });
    expect(screen.getByText('Ubicación GPS')).toBeInTheDocument();
    const tag = document.querySelector('.p-tag');
    expect(tag?.classList.contains('p-tag-success')).toBe(true);
  });

  it('renders "Ubicación aproximada (por IP)" with warn severity for source=ip', async () => {
    await render(SourceBadgeComponent, { inputs: { source: 'ip' } });
    expect(screen.getByText('Ubicación aproximada (por IP)')).toBeInTheDocument();
    const tag = document.querySelector('.p-tag');
    expect(tag?.classList.contains('p-tag-warn')).toBe(true);
  });
});
