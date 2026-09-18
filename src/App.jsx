import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import AuthGate from './components/AuthGate';
import HomePage from './pages/HomePage';
import AuditPage from './pages/AuditPage';
import DashboardPage from './pages/DashboardPage';
import ProgramsPage from './pages/ProgramsPage';
import MessagesPage from './pages/MessagesPage';
import TestsPage from './pages/TestsPage';
import AgendaPage from './pages/AgendaPage';
import TutosPage from './pages/TutosPage';
import CgvPage from './pages/CgvPage';
import OffersPage from './pages/OffersPage';
import BillingPage from './pages/BillingPage';
import AccountPage from './pages/AccountPage';
import { useAuth } from './lib/useAuth';
import { PROTECTED_PAGES } from './constants/protectedPages';
import './index.css';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preselectedProtocol, setPreselectedProtocol] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isLoggedIn, login, logout } = useAuth();

  const handleSetActivePage = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  const goToAudit = (protocolId) => {
    setPreselectedProtocol(protocolId);
    handleSetActivePage('audit');
  };

  const renderPage = () => {
    if (PROTECTED_PAGES.includes(activePage) && !isLoggedIn) {
      return <AuthGate title={getHeaderTitle()} onLoginClick={() => setIsLoginOpen(true)} />;
    }

    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'audit':
        return <AuditPage preselectedProtocol={preselectedProtocol} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'tests':
        return <TestsPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'tutos':
        return <TutosPage />;
      case 'cgv':
        return <CgvPage />;
      case 'offers':
        return <OffersPage onSelectProtocol={goToAudit} />;
      case 'billing':
        return <BillingPage />;
      case 'account':
        return <AccountPage loginEmail={user?.email} />;
      default:
        return <HomePage />;
    }
  };

  const getHeaderTitle = () => {
    const titles = {
      home: 'COACH OSWALD',
      audit: 'Audit de Positionnement',
      dashboard: 'Tableaux de Bord',
      programs: 'Programmes',
      messages: 'Messagerie',
      tests: 'Tests Physiques',
      agenda: 'Agenda & RDV',
      tutos: 'Tutos vidéo',
      cgv: 'CGV/S',
      offers: 'Offres',
      billing: 'Facturation',
      account: 'Mon compte',
    };
    return titles[activePage] || 'COACH OSWALD';
  };

  return (
    <div className="app-container">
      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        activePage={activePage}
        setActivePage={handleSetActivePage}
        isOpen={isMenuOpen}
        isLoggedIn={isLoggedIn}
        userEmail={user?.email}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={logout}
      />
      <div className="main-content">
        <header className="header">
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>{getHeaderTitle()}</h1>
        </header>
        {renderPage()}
      </div>
      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={login} />
      )}
    </div>
  );
}
