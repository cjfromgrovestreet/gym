import { NavLink } from "react-router-dom";

export default function NavTabs() {
  const cls = ({ isActive }) => `nav-btn ${isActive ? "nav-btn--active" : ""}`;
  return (
    <nav className="nav">
      <NavLink to="/" end className={cls}>Početna</NavLink>
      <NavLink to="/profil" className={cls}>Profil</NavLink>
      <NavLink to="/vezbe" className={cls}>Vežbe</NavLink>
      <NavLink to="/treninzi" className={cls}>Treninzi</NavLink>
    </nav>
  );
}