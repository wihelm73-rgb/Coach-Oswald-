import { useState } from 'react';
import { FaTimes, FaLock } from 'react-icons/fa';

// Modale de connexion — bouchon (voir src/lib/useAuth.js) : accepte tout email/mot de passe non
// vides.
export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <FaTimes />
        </button>
        <h2><FaLock /> Connexion</h2>
        <p className="muted">
          Connectez-vous pour accéder au tableau de bord, aux programmes, aux tests physiques et à
          l'agenda.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="cta-button">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
