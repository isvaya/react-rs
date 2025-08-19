import { useTranslations } from 'next-intl';

export default function TestPage() {
  const t = useTranslations('About');
  return <div>Test About Page: {t('title')}</div>;
}
