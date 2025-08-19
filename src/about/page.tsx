import { useTranslations } from 'next-intl';
import './About.css';

export default function AboutPage() {
  const t = useTranslations('About');

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
