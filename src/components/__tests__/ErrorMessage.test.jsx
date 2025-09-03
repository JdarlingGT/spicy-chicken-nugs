import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  test('renders with default props', () => {
    render(<ErrorMessage message="Test error message" />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<ErrorMessage title="Custom Error" message="Test message" />);
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  test('renders different types correctly', () => {
    const { rerender } = render(
      <ErrorMessage type="warning" message="Warning message" />
    );
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    
    rerender(<ErrorMessage type="info" message="Info message" />);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    
    render(
      <ErrorMessage 
        message="Test error" 
        onRetry={mockRetry} 
      />
    );
    
    const retryButton = screen.getByText('🔄 Retry');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const mockDismiss = jest.fn();
    
    render(
      <ErrorMessage 
        message="Test error" 
        onDismiss={mockDismiss} 
      />
    );
    
    const dismissButton = screen.getByText('✕ Dismiss');
    await user.click(dismissButton);
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  test('does not render buttons when callbacks are not provided', () => {
    render(<ErrorMessage message="Test error" />);
    
    expect(screen.queryByText('🔄 Retry')).not.toBeInTheDocument();
    expect(screen.queryByText('✕ Dismiss')).not.toBeInTheDocument();
  });
});