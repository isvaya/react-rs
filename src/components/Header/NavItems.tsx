import { Link } from 'react-router-dom';
import { PATHS } from '../../enums/enum';

export const menuItems = [
  { key: PATHS.MAIN, label: <Link to={PATHS.MAIN}>Main</Link> },
  { key: PATHS.ABOUT, label: <Link to={PATHS.ABOUT}>About</Link> },
];
