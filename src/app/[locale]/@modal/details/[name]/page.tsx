import './MasterDetail.css';
import { fetchPokemonDetail } from '@/servise/pokeApi';
import type { PokemonDetail } from '@/interface/interface';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface DetailsPageProps {
  params: { locale: string; name: string };
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DetailsPage(props: DetailsPageProps) {
  const { locale, name } = await props.params;
  const resolvedSearchParams = await props.searchParams;

  const t = await getTranslations({ locale, namespace: 'Details' });

  const data: PokemonDetail | null = await fetchPokemonDetail(name).catch(
    () => null
  );

  if (!data) {
    notFound();
  }

  const searchQuery = resolvedSearchParams?.search
    ? `?search=${resolvedSearchParams.search}`
    : '';

  return (
    <div className="detail-view">
      <div className="detail-top">
        <Image
          className="detail-image"
          src={data.image}
          alt={data.name}
          width={120}
          height={120}
        />
        <Link
          href={{
            pathname: `/${locale}`,
            query: searchQuery,
          }}
          replace
          className="detail-close"
        >
          ✕
        </Link>
      </div>

      <h2 className="detail-name">{data.name}</h2>
      <p className="detail-description">{data.description}</p>

      <div className="detail-skills-container">
        <div className="detail-skill">
          <h4 className="detail-h4">{t('types')}</h4>
          <ul className="detail-ul">
            {data.types.map((t) => (
              <li key={t} className="detail-li">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">{t('abilities')}</h4>
          <ul className="detail-ul">
            {data.abilities.map((a) => (
              <li key={a} className="detail-li">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-skill">
          <h4 className="detail-h4">{t('stats')}</h4>
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
}
