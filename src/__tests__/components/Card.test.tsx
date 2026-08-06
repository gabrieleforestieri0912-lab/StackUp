import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(<Card label="Featured">Content</Card>);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const motionDiv = container.firstChild as HTMLElement;
    expect(motionDiv?.className).toContain('custom-class');
  });
});
