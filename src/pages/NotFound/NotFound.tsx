import './NotFound.css';

export const NotFound: React.FC = () => {
  return (
    <div className="404-container">
      <img className="image404" src="/404pikachu.png" alt="404-pikachu" />
      <h1 className="title404">404</h1>
      <h3 className="found404">Not Found</h3>
    </div>
  );
};
