import { useNavigate, useParams } from 'react-router-dom';
import type { PokemonDetail } from '../../interface/interface';
import { useEffect, useState } from 'react';
import { fetchPokemonDetail } from '../../servise/pokeApi';
import './MasterDetail.css';
import { PATHS } from '../../enums/enum';

export const Details: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    fetchPokemonDetail(name)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <div className="spinner">Loading details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>No details found.</div>;

  return (
    <div className="detail-view">
      <div className="detail-top">
        <img className="detail-image" src={data.image} alt={data.name} />
        <button onClick={() => navigate(PATHS.MAIN, { replace: true })}>
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
              <li className="detail-li" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">Abilities:</h4>
          <ul className="detail-ul">
            {data.abilities.map((a) => (
              <li className="detail-li" key={a}>
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">Stats:</h4>
          <ul className="detail-ul">
            {data.stats.map((st) => (
              <li className="detail-li" key={st.name}>
                {st.name}: {st.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
