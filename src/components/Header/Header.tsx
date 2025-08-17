'use client';

import { useTheme } from '../../context/ThemeContext';
import { useTranslations } from 'next-intl';
import { PATHS } from '../../enums/enum';
import './Header.css';
import Image from 'next/image';

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Header');

  const menuItems = [
    { key: PATHS.MAIN, label: <Link href={PATHS.MAIN}>{t('main')}</Link> },
    { key: PATHS.ABOUT, label: <Link href={PATHS.ABOUT}>{t('about')}</Link> },
  ];

  const languages = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'ru', label: '🇷🇺 RU' },
  ];

  return (
    <header className="header">
      <div className="header-logo">
        <Image
          className="pokemon-img"
          src="/images.jpeg"
          alt="pikachu"
          width={70}
          height={70}
        />
        <h1 className="title-pokemon">PokéApi</h1>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <div className="locale-switcher">
        {languages.map((lang) => (
          <Link
            key={lang.code}
            href={pathname}
            locale={lang.code}
            className={locale === lang.code ? 'active-locale' : ''}
          >
            {lang.label}
          </Link>
        ))}
      </div>
      <nav className="header-nav">
        <ul className="header-ul">
          {menuItems.map((item) => (
            <li key={item.key} className="header-item">
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
