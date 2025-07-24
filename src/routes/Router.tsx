import { Routes, Route, Outlet } from 'react-router-dom';
import { PATHS } from '../enums/enum';
import { App } from '../App';
import { NotFound } from '../pages/NotFound/NotFound';
import { About } from '../pages/About/About';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path={PATHS.MAIN} element={<App />} />
      <Route path={PATHS.ABOUT} element={<About />} />
      {/* <Route path={PATHS.DETAILS} element={<Details />} /> */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
