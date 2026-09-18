import {
  FaHome, FaDumbbell, FaChartBar, FaClipboard, FaEnvelope, FaCalendar, FaFileAlt, FaTag,
  FaCreditCard, FaVideo, FaIdCard, FaLock, FaSignInAlt, FaSignOutAlt, FaUserCircle,
} from 'react-icons/fa';
import logoImage from '../assets/coach-oswald-logo.png';
import { PROTECTED_PAGES } from '../constants/protectedPages';

export default function Sidebar({ activePage, setActivePage, isOpen, isLoggedIn, userEmail, onOpenLogin, onLogout }) {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: FaHome },
    { id: 'programs', label: 'Programmes', icon: FaDumbbell },
    { id: 'dashboard', label: 'Tableaux de Bord', icon: FaChartBar },
    { id: 'tests', label: 'Tests Physiques', icon: FaClipboard },
    { id: 'messages', label: 'Messagerie', icon: FaEnvelope },
    { id: 'agenda', label: 'Agenda & RDV', icon: FaCalendar },
    { id: 'tutos', label: 'Tutos vidéo', icon: FaVideo },
    { id: 'cgv', label: 'CGV/S', icon: FaFileAlt },
    { id: 'offers', label: 'Offres', icon: FaTag },
    { id: 'billing', label: 'Facturation', icon: FaCreditCard },
    { id: 'account', label: 'Mon compte', icon: FaIdCard },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img
          src={logoImage}
          alt="COACH OSWALD Logo"
          className="sidebar-logo"
        />
      </div>
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const locked = PROTECTED_PAGES.includes(item.id) && !isLoggedIn;
            return (
              <li key={item.id}>
                <button
                  className={`menu-item ${activePage === item.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <IconComponent className="menu-icon" />
                  <span>{item.label}</span>
                  {locked && <FaLock className="lock-badge" title="Connexion requise" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {isLoggedIn ? (
          <>
            <span className="sidebar-user"><FaUserCircle /> {userEmail}</span>
            <button className="auth-btn" onClick={onLogout}>
              <FaSignOutAlt /> Déconnexion
            </button>
          </>
        ) : (
          <button className="auth-btn" onClick={onOpenLogin}>
            <FaSignInAlt /> Connexion
          </button>
        )}
      </div>
    </aside>
  );
}
