export interface PokemonCardRowProps {
  name: string;
  description: string;
}
export function PokemonCardRow({ name, description }: PokemonCardRowProps) {
  return (
    <tr>
      <td className="name-result">{name}</td>
      <td className="description-result">{description}</td>
    </tr>
  );
}
