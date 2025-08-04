import { menuItems } from './NavItems';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-logo">
        <img className="pokemon-img" src="/images.jpeg" alt="pikachu" />
        <h1 className="title-pokemon">PokéApi</h1>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
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
