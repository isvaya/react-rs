import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { Details } from './MasterDetail';
import { fetchPokemonDetail } from '../../servise/pokeApi';
import { PATHS } from '../../enums/enum';
import type { Mock } from 'vitest';

vi.mock('../../servise/pokeApi', () => ({
  fetchPokemonDetail: vi.fn(),
}));

describe('Details (Master-Detail) component', () => {
  const mockDetail = {
    name: 'pikachu',
    image: 'pikachu.png',
    description: 'Electric mouse',
    abilities: ['static', 'lightning-rod'],
    types: ['electric'],
    stats: [
      { name: 'speed', value: 90 },
      { name: 'hp', value: 35 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading indicator while fetching', () => {
    (fetchPokemonDetail as unknown as Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(
      <MemoryRouter initialEntries={[`${PATHS.DETAILS}/pikachu`]}>
        <Routes>
          <Route path={`${PATHS.DETAILS}/:name`} element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('.progress-container')).toBeInTheDocument();
    expect(container.querySelector('.progress-bar')).toBeInTheDocument();
  });

  it('renders error message if fetchPokemonDetail rejects', async () => {
    (fetchPokemonDetail as unknown as Mock).mockRejectedValue(
      new Error('Not found')
    );

    render(
      <MemoryRouter initialEntries={[`${PATHS.DETAILS}/missingmon`]}>
        <Routes>
          <Route path={`${PATHS.DETAILS}/:name`} element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('renders full details on success', async () => {
    (fetchPokemonDetail as unknown as Mock).mockResolvedValue(mockDetail);

    render(
      <MemoryRouter initialEntries={[`${PATHS.DETAILS}/pikachu`]}>
        <Routes>
          <Route path={`${PATHS.DETAILS}/:name`} element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        /pikachu/i
      );
      expect(screen.getByText(/Electric mouse/i)).toBeInTheDocument();
    });

    const img = screen.getByAltText(/pikachu/i);
    expect(img).toHaveAttribute('src', 'pikachu.png');

    expect(screen.getByText('Types:')).toBeInTheDocument();
    mockDetail.types.forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );

    expect(screen.getByText('Abilities:')).toBeInTheDocument();
    mockDetail.abilities.forEach((a) =>
      expect(screen.getByText(a)).toBeInTheDocument()
    );

    expect(screen.getByText('Stats:')).toBeInTheDocument();
    mockDetail.stats.forEach((st) =>
      expect(
        screen.getByText(new RegExp(`${st.name}: ${st.value}`))
      ).toBeInTheDocument()
    );
  });
});
