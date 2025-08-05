import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../../servise/pokeApi';
import type { PokemonDetail } from '../../interface/interface';
import './MasterDetail.css';
import { PATHS } from '../../enums/enum';

export const Details: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const nameParam = name ?? '';
  const navigate = useNavigate();
  const { search } = useLocation();

  const { data, isLoading, isError, error } = useQuery<
    PokemonDetail,
    Error,
    PokemonDetail,
    ['pokemonDetail', string]
  >({
    queryKey: ['pokemonDetail', nameParam],
    queryFn: () => fetchPokemonDetail(nameParam),
    enabled: nameParam !== '',
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="progress-container">
        <div className="progress-bar" />
      </div>
    );
  }

  if (isError) {
    return <div className="error">{error.message}</div>;
  }

  if (!data) {
    return <div>No details found.</div>;
  }

  return (
    <div className="detail-view">
      <div className="detail-top">
        <img className="detail-image" src={data.image} alt={data.name} />
        <button
          className="detail-close"
          onClick={() => navigate(`${PATHS.MAIN}${search}`, { replace: true })}
        >
          ✕
        </button>
      </div>

      <h2 className="detail-name">{data.name}</h2>
      <p className="detail-description">{data.description}</p>

      <div className="detail-skills-container">
        <div className="detail-skill">
          <h4 className="detail-h4">Types:</h4>
          <ul className="detail-ul">
            {data.types.map((t) => (
              <li key={t} className="detail-li">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">Abilities:</h4>
          <ul className="detail-ul">
            {data.abilities.map((a) => (
              <li key={a} className="detail-li">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">Stats:</h4>
          <ul className="detail-ul">
            {data.stats.map((st) => (
              <li key={st.name} className="detail-li">
                {st.name}: {st.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
