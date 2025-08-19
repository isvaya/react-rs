import { getTranslations } from 'next-intl/server';
import { App } from '../../App';

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolved = (await searchParams) || {};
  const search = (resolved.search as string) ?? '';
  const page = parseInt((resolved.page as string) ?? '1', 10);

  const t = await getTranslations({ locale: 'en', namespace: 'Home' });

  return (
    <>
      <div>
        <h1>{t('title')}</h1>
      </div>
      <App search={search} page={page} />
    </>
  );
}
