import { FaLock } from 'react-icons/fa';

// Affiché à la place d'une page protégée quand l'utilisateur n'est pas connecté.
export default function AuthGate({ title, onLoginClick }) {
  return (
    <div className="page-content auth-gate">
      <div className="coming-soon-container">
        <FaLock className="lock-icon" />
        <h2>{title}</h2>
        <p className="coming-soon-text">
          Cette section est réservée aux utilisateurs connectés.
        </p>
        <button className="cta-button" onClick={onLoginClick}>Se connecter</button>
      </div>
    </div>
  );
}
