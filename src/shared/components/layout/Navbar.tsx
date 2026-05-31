import { Link, NavLink } from "react-router-dom";
import houseOfLegendsBadge from "../../../assets/house-of-legends-badge.svg";

const navItems = [
  { to: "/champions", label: "Champions" },
  { to: "/items", label: "Items" },
  { to: "/builds", label: "Builds" },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand-link" aria-label="House of Legends home">
          <img
            src={houseOfLegendsBadge}
            alt=""
            aria-hidden="true"
            className="brand-mark"
          />
          <span className="brand-name">House of Legends</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
