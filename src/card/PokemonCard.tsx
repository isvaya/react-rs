import {
  useNavigate as _useNavigate,
  useLocation as _useLocation,
  type NavigateFunction,
} from 'react-router-dom';
import type { PokemonWithDescription } from '../interface/interface';
import { PATHS } from '../enums/enum';
import { usePokemonStore } from '../store/usePokemonStore';

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
  const toggleSelect = usePokemonStore((s) => s.toggleSelect);
  const selected = usePokemonStore((s) => !!s.selected[name]);
  const onClick = () => {
    navigate(`${PATHS.DETAILS}/${name}${search}`);
  };

  return (
    <tr className="tr-results" onClick={onClick}>
      <td>
        <input
          className="checkbox"
          type="checkbox"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleSelect({ name, description })}
        />
      </td>
      <td className="name-result" onClick={onClick}>
        {name}
      </td>
      <td className="description-result" onClick={onClick}>
        {description}
      </td>
    </tr>
  );
}
