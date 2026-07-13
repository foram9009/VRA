// __tests__/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders with default variant and text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
  });

  test('applies correct classes for secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-surface');
  });
});
