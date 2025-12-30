import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

const mockOnSearch = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} loading={false} />);
    
    expect(screen.getByPlaceholderText('Search podcasts...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🔍/i })).toBeInTheDocument();
  });

  test('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} loading={false} />);
    
    const input = screen.getByPlaceholderText('Search podcasts...');
    const button = screen.getByRole('button', { name: /🔍/i });
    
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  test('disables input and button when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} loading={true} />);
    
    expect(screen.getByPlaceholderText('Search podcasts...')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
