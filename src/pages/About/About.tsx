'use client';

import './About.css';
import { useTranslations } from 'next-intl';

export const About: React.FC = () => {
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
};
