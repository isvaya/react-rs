import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchResult } from './SearchResults';
import { PokemonCardRow } from '../card/PokemonCard';

describe('SearchResult', () => {
  it('shows spinner when loading=true', () => {
    const { container } = render(<SearchResult history={[]} loading={true} />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders title and strokes of table from history', () => {
    const history = [
      { name: 'pickachu', description: 'electric mouse' },
      { name: 'eevee', description: 'evolution Pokemon' },
    ];
    render(<SearchResult history={history} loading={false} />);

    expect(screen.getByText('RESULTS:')).toBeInTheDocument();

    history.forEach(({ name, description }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('render correct quantity of strokes in <tbody>', () => {
    const history = [
      { name: 'a', description: '1' },
      { name: 'b', description: '2' },
      { name: 'c', description: '3' },
    ];
    const { container } = render(
      <SearchResult history={history} loading={false} />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(history.length);
  });

  it('renders a row with name and description', () => {
    render(
      <table>
        <tbody>
          <PokemonCardRow name="mew" description="Ancient" />
        </tbody>
      </table>
    );
    expect(screen.getByText('mew')).toBeInTheDocument();
    expect(screen.getByText('Ancient')).toBeInTheDocument();
  });
});
