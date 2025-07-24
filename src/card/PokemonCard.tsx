import { useNavigate } from 'react-router-dom';
import type { PokemonWithDescription } from '../interface/interface';
import { PATHS } from '../enums/enum';

// }
export function PokemonCardRow({ name, description }: PokemonWithDescription) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`${PATHS.DETAILS}/${name}`);
  };

  return (
    <tr className="tr-results" onClick={onClick}>
      <td className="name-result">{name}</td>
      <td className="description-result">{description}</td>
    </tr>
  );
}
