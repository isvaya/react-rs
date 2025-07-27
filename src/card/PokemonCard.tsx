import {
  useNavigate as _useNavigate,
  useLocation as _useLocation,
  type NavigateFunction,
} from 'react-router-dom';
import type { PokemonWithDescription } from '../interface/interface';
import { PATHS } from '../enums/enum';

function useSaveNavigate(): NavigateFunction {
  try {
    return _useNavigate();
  } catch {
    return () => {};
  }
}

function useSafeLocation(): Pick<Location, 'search'> {
  try {
    const loc = _useLocation();
    return { search: loc.search };
  } catch {
    return { search: '' };
  }
}

export function PokemonCardRow({ name, description }: PokemonWithDescription) {
  const navigate = useSaveNavigate();
  const { search } = useSafeLocation();
  const onClick = () => {
    navigate(`${PATHS.DETAILS}/${name}${search}`);
  };

  return (
    <tr className="tr-results" onClick={onClick}>
      <td className="name-result">{name}</td>
      <td className="description-result">{description}</td>
    </tr>
  );
}
