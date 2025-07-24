import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="github">
        <img className="github-logo" src="/github.png" alt="github-logo" />
        <a href="https://github.com/isvaya">Github</a>
      </div>
      <p className="year">2025 ⓒ</p>
      <div className="school">
        <img className="rs-logo" src="/rs-logo.png" alt="rs-logo" />
        <a href="https://rs.school/courses/reactjs">RS School</a>
      </div>
    </footer>
  );
};
