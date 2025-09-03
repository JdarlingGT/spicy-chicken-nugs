import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    render(<LoadingSpinner message="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  test('renders without message when message is null', () => {
    render(<LoadingSpinner message={null} />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('applies fullScreen styles when fullScreen is true', () => {
    const { container } = render(<LoadingSpinner fullScreen={true} />);
    
    const spinnerContainer = container.firstChild.lastChild;
    expect(spinnerContainer).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    });
  });

  test('applies different sizes correctly', () => {
    const { rerender, container } = render(<LoadingSpinner size="small" />);
    
    let spinner = container.querySelector('div > div');
    expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    
    rerender(<LoadingSpinner size="large" />);
    spinner = container.querySelector('div > div');
    expect(spinner).toHaveStyle({ width: '64px', height: '64px' });
  });
});