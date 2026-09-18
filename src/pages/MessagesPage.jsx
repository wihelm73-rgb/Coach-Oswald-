import { useState } from 'react';
import { FaWhatsapp, FaVideo, FaPhoneAlt, FaPaperPlane, FaExternalLinkAlt, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { SiGooglemeet } from 'react-icons/si';
import './MessagesPage.css';

/* =====================================================================
 * CONFIGURATION DES CONTACTS
 * Le numéro WhatsApp sera fourni plus tard : renseignez-le ci-dessous au
 * format international SANS "+", espace ni "0" initial.
 * Exemple France : "33612345678"  (pour 06 12 34 56 78)
 * ===================================================================== */
const CONTACT = {
  whatsappNumber: '', // ← À COMPLÉTER (ex : "33612345678")
  meetLink: '', // ← (optionnel) lien d'une salle Google Meet fixe, ex : "https://meet.google.com/abc-defg-hij"
  coachName: 'Coach Oswald',
};

/* Messages rapides pré-remplis pour WhatsApp */
const QUICK_MESSAGES = [
  'Bonjour Coach 👋, je souhaite des informations sur les offres.',
  "J'aimerais planifier une séance de coaching.",
  "J'ai une question sur mon programme d'entraînement.",
  'Pouvons-nous prévoir une visio cette semaine ?',
];

const buildWaLink = (number, text) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export default function MessagesPage() {
  const [message, setMessage] = useState('');
  const whatsappReady = Boolean(CONTACT.whatsappNumber);

  const openWhatsApp = (text) => {
    if (!whatsappReady) return;
    window.open(buildWaLink(CONTACT.whatsappNumber, text), '_blank', 'noopener');
  };

  const startMeet = () => {
    const url = CONTACT.meetLink || 'https://meet.google.com/new';
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="messages-page">
      <div className="msg-intro">
        <h2>Restons en contact</h2>
        <p className="muted">
          Échangez avec {CONTACT.coachName} par message, appel ou visioconférence.
        </p>
      </div>

      {/* Canaux de contact */}
      <div className="channel-grid">
        {/* WhatsApp — Discussion */}
        <div className="channel-card whatsapp">
          <div className="channel-icon"><FaWhatsapp /></div>
          <h3>WhatsApp</h3>
          <p className="muted">Messagerie instantanée, photos et messages vocaux.</p>
          <button className="btn btn-wa" disabled={!whatsappReady} onClick={() => openWhatsApp('')}>
            <FaPaperPlane /> Démarrer la discussion
          </button>
          {!whatsappReady && <span className="config-note"><FaInfoCircle /> Numéro à venir</span>}
        </div>

        {/* WhatsApp — Appel / Visio */}
        <div className="channel-card call">
          <div className="channel-icon"><FaPhoneAlt /></div>
          <h3>Appel & Visio WhatsApp</h3>
          <p className="muted">Appel audio ou vidéo directement depuis WhatsApp.</p>
          <button className="btn btn-call" disabled={!whatsappReady} onClick={() => openWhatsApp('Bonjour Coach, êtes-vous disponible pour un appel ?')}>
            <FaPhoneAlt /> Demander un appel
          </button>
          {!whatsappReady && <span className="config-note"><FaInfoCircle /> Numéro à venir</span>}
        </div>

        {/* Google Meet */}
        <div className="channel-card meet">
          <div className="channel-icon"><SiGooglemeet /></div>
          <h3>Google Meet</h3>
          <p className="muted">Visioconférence HD dans votre navigateur, sans installation.</p>
          <button className="btn btn-meet" onClick={startMeet}>
            <FaVideo /> {CONTACT.meetLink ? 'Rejoindre la salle' : 'Démarrer une visio'}
            <FaExternalLinkAlt className="ext" />
          </button>
        </div>
      </div>

      {/* Composer un message WhatsApp */}
      <div className="composer">
        <h3>Envoyer un message</h3>
        <div className="quick-msgs">
          {QUICK_MESSAGES.map((m, i) => (
            <button key={i} className="quick-chip" onClick={() => setMessage(m)}>
              {m}
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message… il s'ouvrira directement dans WhatsApp."
        />
        <div className="composer-actions">
          <button
            className="btn btn-wa"
            disabled={!whatsappReady || !message.trim()}
            onClick={() => openWhatsApp(message.trim())}
          >
            <FaWhatsapp /> Envoyer sur WhatsApp
          </button>
        </div>
        {!whatsappReady && (
          <p className="config-banner">
            <FaExclamationTriangle /> Le numéro WhatsApp de {CONTACT.coachName} n'est pas encore configuré.
          </p>
        )}
      </div>
    </div>
  );
}
