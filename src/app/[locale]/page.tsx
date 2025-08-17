'use client';

import { useTranslations } from 'next-intl';
import { App } from '../../App';

export default function HomePage() {
  const t = useTranslations('Home');
  return (
    <>
      <div>
        <h1>{t('title')}</h1>
      </div>
      <App />
    </>
  );
}
