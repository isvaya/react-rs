'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { PokemonWithDescription } from '../interface/interface';
import { PATHS } from '../enums/enum';
import { usePokemonStore } from '../store/usePokemonStore';

export function PokemonCardRow({ name, description }: PokemonWithDescription) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const toggleSelect = usePokemonStore((s) => s.toggleSelect);
  const selected = usePokemonStore((s) => !!s.selected[name]);

  const onClick = () => {
    router.push(`${PATHS.DETAILS}/${name}${search ? `?${search}` : ''}`);
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
