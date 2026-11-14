import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Assets', end: true },
  { to: '/add', label: 'Add Asset' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" end>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <strong>RectAssets</strong>
            <small>IT Asset Manager</small>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
