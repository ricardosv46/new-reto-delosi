import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show the initial value', () => {
    render(<SearchBar initialValue="watch" onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('Buscar productos...')).toHaveValue('watch');
  });

  it('should debounce typing and search once the user stops', () => {
    const onSearch = jest.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Buscar productos...'), {
      target: { value: 'bag' },
    });
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(450);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('bag');
  });

  it('should not search again when the value equals the current filter', () => {
    const onSearch = jest.fn();
    render(<SearchBar initialValue="bag" onSearch={onSearch} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should search immediately when clicking "Buscar"', () => {
    const onSearch = jest.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Buscar productos...'), {
      target: { value: 'ring' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('ring');
  });

  it('should clear the input and the filter with the clear button', () => {
    const onSearch = jest.fn();
    render(<SearchBar initialValue="ring" onSearch={onSearch} />);

    fireEvent.click(screen.getByLabelText('Limpiar búsqueda'));

    expect(screen.getByPlaceholderText('Buscar productos...')).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('should hide the clear button while the input is empty', () => {
    render(<SearchBar initialValue="" onSearch={jest.fn()} />);

    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('should follow the URL when the initial value changes from outside', () => {
    const { rerender } = render(<SearchBar initialValue="ring" onSearch={jest.fn()} />);

    rerender(<SearchBar initialValue="" onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('Buscar productos...')).toHaveValue('');
  });
});
