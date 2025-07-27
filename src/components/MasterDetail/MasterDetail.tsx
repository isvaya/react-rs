import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { PokemonDetail } from '../../interface/interface';
import { useEffect, useState, useRef } from 'react';
import { fetchPokemonDetail } from '../../servise/pokeApi';
import './MasterDetail.css';
import { PATHS } from '../../enums/enum';

export const Details: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError(null);
    setData(null);
    setProgress(0);

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 5 + 1, 90));
    }, 200);

    fetchPokemonDetail(name)
      .then((p) => {
        setData(p);
        setProgress(100);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setLoading(false);
        setProgress(100);
        setTimeout(() => {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
        }, 500);
      });

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [name]);

  if (loading) {
    return (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>No details found.</div>;

  return (
    <div className="detail-view">
      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {data && (
        <div className="detail-top">
          <img className="detail-image" src={data.image} alt={data.name} />
          <button
            className="detail-close"
            onClick={() =>
              navigate(`${PATHS.MAIN}${search}`, { replace: true })
            }
          >
            ✕
          </button>
        </div>
      )}

      {data && (
        <>
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
        </>
      )}
    </div>
  );
};
