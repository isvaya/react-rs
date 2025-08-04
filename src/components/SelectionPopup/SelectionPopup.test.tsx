import { render, screen, fireEvent } from '@testing-library/react';
import {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  expect,
  vi,
} from 'vitest';
import { usePokemonStore } from '../../store/usePokemonStore';
import { SelectionPopup } from './SelectionPopup';

describe('SelectionPopup', () => {
  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob://1'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn(),
    });
  });

  beforeEach(() => {
    usePokemonStore.setState({ selected: {} });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render if no elements are selected', () => {
    render(<SelectionPopup />);
    expect(screen.queryByText(/Selected/)).toBeNull();
  });

  it('shows quantity and two buttons if selected', () => {
    usePokemonStore.getState().toggleSelect({ name: 'p', description: 'd' });
    usePokemonStore.getState().toggleSelect({ name: 'q', description: 'd2' });

    render(<SelectionPopup />);
    expect(screen.getByText(/Selected 2 elements/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Deselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download CSV/i })
    ).toBeInTheDocument();
  });

  it('"Deselect all" clears the store and removes the popup', () => {
    usePokemonStore.getState().toggleSelect({ name: 'x', description: 'd' });
    render(<SelectionPopup />);

    fireEvent.click(screen.getByRole('button', { name: /Deselect all/i }));
    expect(Object.values(usePokemonStore.getState().selected)).toHaveLength(0);
    expect(screen.queryByText(/Selected/)).toBeNull();
  });

  it('"Download CSV" generates a csv and causes a click on the link', () => {
    const urlSpy = vi.spyOn(URL, 'createObjectURL');
    const realCreate = document.createElement.bind(document);
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: clickMock,
        } as unknown as HTMLAnchorElement;
      }
      return realCreate(tag);
    });

    usePokemonStore
      .getState()
      .toggleSelect({ name: 'mew', description: 'desc' });
    render(<SelectionPopup />);

    fireEvent.click(screen.getByRole('button', { name: /Download CSV/i }));
    expect(urlSpy).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });
});
