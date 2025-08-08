import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PokemonCardRow } from './PokemonCard';
import { usePokemonStore } from '../store/usePokemonStore';
import { PATHS } from '../enums/enum';

const navigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => navigateSpy,
    useLocation: () => ({ search: '?search=&page=1' }),
  };
});

describe('PokemonCardRow interactions', () => {
  beforeEach(() => {
    usePokemonStore.setState({ selected: {} });
    navigateSpy.mockClear();
  });

  const renderRow = (name = 'pikachu', description = 'Electric mouse') =>
    render(
      <table>
        <tbody>
          <PokemonCardRow name={name} description={description} />
        </tbody>
      </table>
    );

  it('navigates to details on name cell click', () => {
    renderRow('pikachu', 'Electric mouse');
    fireEvent.click(screen.getByText(/pikachu/i));
    expect(navigateSpy).toHaveBeenCalledWith(
      `${PATHS.DETAILS}/pikachu?search=&page=1`
    );
  });

  it('the checkbox toggles the selection and remains checked', async () => {
    render(
      <table>
        <tbody>
          <PokemonCardRow name="eevee" description="Evolution" />
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(usePokemonStore.getState().selected['eevee']).toEqual({
        name: 'eevee',
        description: 'Evolution',
      });
    });

    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      true
    );
  });

  it('checkbox is initially checked when item preselected', () => {
    usePokemonStore.setState({
      selected: { snorlax: { name: 'snorlax', description: 'Sleep' } },
    });

    renderRow('snorlax', 'Sleep');

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
