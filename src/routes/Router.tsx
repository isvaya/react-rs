import { Routes, Route, Outlet } from 'react-router-dom';
import { PATHS } from '../enums/enum';
import { App } from '../App';
import { NotFound } from '../pages/NotFound/NotFound';
import { About } from '../pages/About/About';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Details } from '../components/MasterDetail/MasterDetail';

const HeaderFooterLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const MasterDetailLayout: React.FC = () => {
  return (
    <div className="master-detail-container">
      <div className="master-panel">
        <App />
      </div>
      <div className="detail-panel">
        <Outlet />
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<HeaderFooterLayout />}>
      <Route path={PATHS.MAIN} element={<MasterDetailLayout />}>
        <Route index element={null} />
        <Route
          path={`${PATHS.DETAILS.replace(/^\//, '')}/:name`}
          element={<Details />}
        />
      </Route>
      <Route path={PATHS.ABOUT} element={<About />} />
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
