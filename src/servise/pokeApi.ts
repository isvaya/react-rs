import type {
  PokemonListResponse,
  PokemonSpeciesResponse,
  PokemonDetail,
  PokemonApiResponse,
} from '../interface/interface';

export async function fetchPokemonList(
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return await res.json();
}

export async function fetchPokemonDescription(url: string): Promise<string> {
  const resPokemon = await fetch(url);
  if (!resPokemon.ok) throw new Error(`HTTP error: ${resPokemon.status}`);
  const pokemonData = (await resPokemon.json()) as { species: { url: string } };

  const resSpecies = await fetch(pokemonData.species.url);
  if (!resSpecies.ok) throw new Error(`HTTP error: ${resSpecies.status}`);
  const speciesData = (await resSpecies.json()) as PokemonSpeciesResponse;

  const entry = speciesData.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  );
  return entry ? entry.flavor_text.replace(/\s+/g, ' ') : 'No description';
}

export async function fetchPokemonByName(
  name: string
): Promise<{ name: string; description: string }> {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;

  try {
    const description = await fetchPokemonDescription(pokemonUrl);
    return { name, description };
  } catch {
    throw new Error(`Pokemon "${name}" not found`);
  }
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  await new Promise((res) => setTimeout(res, 1500));

  const p = await getJSON<PokemonApiResponse>(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  );

  const s = await getJSON<PokemonSpeciesResponse>(p.species.url);
  const entry = s.flavor_text_entries.find((e) => e.language.name === 'en');
  const description = entry
    ? entry.flavor_text.replace(/\s+/g, ' ')
    : 'No description available';

  const artUrl =
    p.sprites.other?.['official-artwork']?.front_default ||
    p.sprites.front_default ||
    '';

  return {
    name: p.name,
    image: artUrl,

    abilities: p.abilities.map((a) => a.ability.name),
    types: p.types.map((t) => t.type.name),

    stats: p.stats.map((st) => ({
      name: st.stat.name,
      value: st.base_stat,
    })),

    description,
  };
}
