import { menuItems } from './NavItems';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img className="pokemon-img" src="/images.jpeg" alt="pikachu" />
        <h1 className="title-pokemon">PokéApi</h1>
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
