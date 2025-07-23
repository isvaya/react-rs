import { Routes, Route } from 'react-router-dom';
import { PATHS } from '../enums/enum';
import { App } from '../App';
import { NotFound } from '../pages/NotFound/NotFound';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path={PATHS.MAIN} element={<App />} />
    {/* <Route path={PATHS.ABOUT} element={About />} /> */}
    {/* <Route path={PATHS.DETAILS} element={<Details />} /> */}
    <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
  </Routes>
);
