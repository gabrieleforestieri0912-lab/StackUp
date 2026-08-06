import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionTitle from '@/components/ui/SectionTitle';

describe('SectionTitle', () => {
  it('renders maskText elements', () => {
    render(<SectionTitle maskText={['Hello', 'World']} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<SectionTitle title="Sub text" maskText={['Title']} />);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });
});
