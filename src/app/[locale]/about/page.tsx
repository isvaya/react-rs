import './About.css';
import { routing } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // вместо useTranslations — серверный getTranslations
  const t = await getTranslations({ locale, namespace: 'About' });

  return (
    <div className="about-container">
      <h1 className="about-title">{t('title')}</h1>
      <h3 className="about-greet">{t('greet')}</h3>
      <p className="about-text">{t('p1')}</p>
      <p className="about-text">{t('p2')}</p>
      <p className="about-text">{t('p3')}</p>
      <p className="about-text">{t('p4')}</p>
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
