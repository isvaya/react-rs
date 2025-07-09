import type {
  PokemonListResponse,
  PokemonSpeciesResponse,
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
  // const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  // if (!res.ok) {
  //   throw new Error(`HTTP error: ${res.status}`);
  // }

  // return await res.json();
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;

  try {
    const description = await fetchPokemonDescription(pokemonUrl);
    return { name, description };
  } catch {
    throw new Error(`Pokemon "${name}" not found`);
  }
}
