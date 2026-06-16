export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">House of Legends</p>
        <p className="footer__text">
          A League companion · Crafted with ancient runes
        </p>
        <p className="footer__year">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};
