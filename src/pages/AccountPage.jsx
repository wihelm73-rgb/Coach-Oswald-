import { useState } from 'react';
import { FaIdCard, FaEnvelope, FaPhone, FaSave, FaCheckCircle } from 'react-icons/fa';
import './AccountPage.css';

const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

const LS_PROFILE = 'oswald_profile';

// Page de visualisation/édition des infos de compte (prénom, nom, email de contact, téléphone).
// L'email de connexion vient de la session (useAuth) et n'est pas modifiable ici.
export default function AccountPage({ loginEmail }) {
  const [profile, setProfile] = useState(() =>
    loadLS(LS_PROFILE, { firstName: '', lastName: '', email: loginEmail || '', phone: '' })
  );
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLS(LS_PROFILE, profile);
    setSaved(true);
  };

  return (
    <div className="account-page">
      <div className="account-intro">
        <h2><FaIdCard /> Mon compte</h2>
        <p className="muted">Vos informations personnelles.</p>
      </div>

      <div className="account-card">
        <div className="account-login-info">
          <FaEnvelope />
          <span>Connecté avec : <strong>{loginEmail}</strong></span>
        </div>

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-row">
            <label>
              Prénom
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Votre prénom"
              />
            </label>
            <label>
              Nom
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Votre nom"
              />
            </label>
          </div>

          <label>
            <FaEnvelope /> Email de contact
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="email@exemple.fr"
            />
          </label>

          <label>
            <FaPhone /> Téléphone
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </label>

          <div className="account-actions">
            <button type="submit" className="cta-button"><FaSave /> Enregistrer</button>
            {saved && <span className="account-saved"><FaCheckCircle /> Enregistré</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
