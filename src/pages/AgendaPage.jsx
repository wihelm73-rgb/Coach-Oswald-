import { useState } from 'react';
import {
  FaCalendarPlus, FaCalendarCheck, FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt,
  FaWhatsapp, FaTrash, FaCheck, FaTimes, FaGoogle, FaDownload, FaBell, FaRegClock,
} from 'react-icons/fa';
import './AgendaPage.css';

/* =====================================================================
 * CONFIGURATION AGENDA — À PERSONNALISER PAR LE COACH
 * ===================================================================== */
const WHATSAPP_NUMBER = ''; // ← même numéro que la Messagerie, ex : "33612345678"
const COACH_NAME = 'Coach Oswald';

/* Disponibilités hebdomadaires (créneaux proposés au client) */
const DISPONIBILITES = [
  { jour: 'Lundi', creneaux: ['09:00', '10:00', '11:00', '17:00', '18:00', '19:00'] },
  { jour: 'Mardi', creneaux: ['09:00', '10:00', '18:00', '19:00'] },
  { jour: 'Mercredi', creneaux: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
  { jour: 'Jeudi', creneaux: ['09:00', '10:00', '18:00', '19:00'] },
  { jour: 'Vendredi', creneaux: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
  { jour: 'Samedi', creneaux: ['09:00', '10:00', '11:00'] },
];
const ALL_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

/* Types de rendez-vous (durée en minutes) */
const TYPES_RDV = [
  { id: 'decouverte', label: 'Séance découverte (offerte)', duree: 45 },
  { id: 'individuel', label: 'Séance individuelle', duree: 60 },
  { id: 'visio', label: 'Coaching en visio', duree: 60 },
  { id: 'bilan', label: 'Bilan / suivi', duree: 30 },
];

const LS_RDV = 'oswald_rdv';
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const pad = (n) => String(n).padStart(2, '0');
const typeById = (id) => TYPES_RDV.find((t) => t.id === id) || TYPES_RDV[0];

/* Date/heure de début + fin (objets Date locaux) */
const rdvDates = (rdv) => {
  const start = new Date(`${rdv.date}T${rdv.time}:00`);
  const end = new Date(start.getTime() + typeById(rdv.type).duree * 60000);
  return { start, end };
};
const fmtICS = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const fmtFrDate = (d) =>
  d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

const STATUS = {
  demande: { label: 'Demandé', cls: 'st-demande' },
  confirme: { label: 'Confirmé', cls: 'st-confirme' },
  annule: { label: 'Annulé', cls: 'st-annule' },
};

export default function AgendaPage() {
  const [rdvs, setRdvs] = useState(() => loadLS(LS_RDV, []));
  const todayStr = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ type: 'decouverte', date: todayStr, time: '09:00', mode: 'presentiel', note: '' });

  const persist = (next) => { setRdvs(next); saveLS(LS_RDV, next); };

  const addRdv = (e) => {
    e.preventDefault();
    persist([{ id: uid(), ...form, status: 'demande', createdAt: new Date().toISOString() }, ...rdvs]);
    setForm((f) => ({ ...f, note: '' }));
  };
  const setStatus = (id, status) => persist(rdvs.map((r) => (r.id === id ? { ...r, status } : r)));
  const remove = (id) => persist(rdvs.filter((r) => r.id !== id));

  /* Tri chronologique + séparation à venir / passés */
  const now = new Date();
  const sorted = [...rdvs].sort((a, b) => rdvDates(a).start - rdvDates(b).start);
  const upcoming = sorted.filter((r) => rdvDates(r).end >= now && r.status !== 'annule');
  const others = sorted.filter((r) => rdvDates(r).end < now || r.status === 'annule').reverse();

  const buildTitle = (rdv) => `${typeById(rdv.type).label} — ${COACH_NAME}`;

  const googleLink = (rdv) => {
    const { start, end } = rdvDates(rdv);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: buildTitle(rdv),
      dates: `${fmtICS(start)}/${fmtICS(end)}`,
      details: `Mode : ${rdv.mode === 'visio' ? 'Visioconférence' : 'Présentiel'}${rdv.note ? `\nNote : ${rdv.note}` : ''}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const downloadICS = (rdv) => {
    const { start, end } = rdvDates(rdv);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Coach Oswald//Agenda//FR', 'BEGIN:VEVENT',
      `UID:${rdv.id}@coach-oswald`, `DTSTAMP:${fmtICS(new Date())}`,
      `DTSTART:${fmtICS(start)}`, `DTEND:${fmtICS(end)}`,
      `SUMMARY:${buildTitle(rdv)}`,
      `DESCRIPTION:Mode ${rdv.mode === 'visio' ? 'Visioconférence' : 'Présentiel'}${rdv.note ? ' - ' + rdv.note : ''}`,
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Rappel séance', 'END:VALARM',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Rappel séance demain', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `rdv-coach-oswald-${rdv.date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmWhatsApp = (rdv) => {
    if (!WHATSAPP_NUMBER) return;
    const { start } = rdvDates(rdv);
    const text = `Bonjour ${COACH_NAME} 👋, je souhaite confirmer un rendez-vous : ${typeById(rdv.type).label}, le ${fmtFrDate(start)} à ${rdv.time} (${rdv.mode === 'visio' ? 'visio' : 'présentiel'}).`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <div className="agenda-page">
      <div className="agenda-intro">
        <h2>Agenda & rendez-vous</h2>
        <p className="muted">Gestion des rendez-vous, synchronisation des horaires et rappels automatisés.</p>
      </div>

      <div className="agenda-layout">
        {/* ---- Colonne gauche : demande de RDV ---- */}
        <section className="agenda-form-card">
          <h3><FaCalendarPlus /> Demander un rendez-vous</h3>
          <form onSubmit={addRdv}>
            <label className="field">
              <span>Type de séance</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES_RDV.map((t) => (
                  <option key={t.id} value={t.id}>{t.label} · {t.duree} min</option>
                ))}
              </select>
            </label>

            <div className="field-row">
              <label className="field">
                <span>Date</span>
                <input type="date" min={todayStr} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </label>
              <label className="field">
                <span>Horaire</span>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  {ALL_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <div className="field">
              <span>Mode</span>
              <div className="mode-toggle">
                <button type="button" className={form.mode === 'presentiel' ? 'active' : ''} onClick={() => setForm({ ...form, mode: 'presentiel' })}>
                  <FaMapMarkerAlt /> Présentiel
                </button>
                <button type="button" className={form.mode === 'visio' ? 'active' : ''} onClick={() => setForm({ ...form, mode: 'visio' })}>
                  <FaVideo /> Visio
                </button>
              </div>
            </div>

            <label className="field">
              <span>Note (optionnel)</span>
              <textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Objectif, contrainte horaire…" />
            </label>

            <button type="submit" className="btn-add"><FaCalendarPlus /> Ajouter le rendez-vous</button>
          </form>

          {/* Disponibilités */}
          <div className="dispo-block">
            <h4><FaRegClock /> Créneaux habituels</h4>
            <ul className="dispo-list">
              {DISPONIBILITES.map((d) => (
                <li key={d.jour}>
                  <span className="dispo-day">{d.jour}</span>
                  <span className="dispo-slots">{d.creneaux.join(' · ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- Colonne droite : liste des RDV ---- */}
        <section className="agenda-list">
          <div className="reminder-banner">
            <FaBell /> Ajoutez vos rendez-vous à <strong>Google Agenda</strong> ou via le fichier{' '}
            <strong>.ics</strong> pour activer les <strong>rappels automatiques</strong> (1 jour et 1 h avant).
          </div>

          <h3><FaCalendarCheck /> Rendez-vous à venir <span className="count">{upcoming.length}</span></h3>
          {upcoming.length === 0 ? (
            <p className="muted empty">Aucun rendez-vous à venir. Demandez votre première séance →</p>
          ) : (
            upcoming.map((r) => (
              <RdvCard key={r.id} rdv={r} onStatus={setStatus} onRemove={remove}
                google={googleLink} ics={downloadICS} whatsapp={confirmWhatsApp} waReady={!!WHATSAPP_NUMBER} />
            ))
          )}

          {others.length > 0 && (
            <>
              <h3 className="past-title"><FaCalendarAlt /> Historique & annulés</h3>
              {others.map((r) => (
                <RdvCard key={r.id} rdv={r} past onStatus={setStatus} onRemove={remove}
                  google={googleLink} ics={downloadICS} whatsapp={confirmWhatsApp} waReady={!!WHATSAPP_NUMBER} />
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function RdvCard({ rdv, past, onStatus, onRemove, google, ics, whatsapp, waReady }) {
  const { start } = rdvDates(rdv);
  const t = typeById(rdv.type);
  const st = STATUS[rdv.status];
  return (
    <div className={`rdv-card ${past ? 'past' : ''} ${rdv.status === 'annule' ? 'cancelled' : ''}`}>
      <div className="rdv-date-box">
        <span className="rdv-day">{start.toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
        <span className="rdv-month">{start.toLocaleDateString('fr-FR', { month: 'short' })}</span>
      </div>
      <div className="rdv-info">
        <div className="rdv-top">
          <strong>{t.label}</strong>
          <span className={`status ${st.cls}`}>{st.label}</span>
        </div>
        <div className="rdv-meta">
          <span><FaClock /> {rdv.time} · {t.duree} min</span>
          <span>{rdv.mode === 'visio' ? <><FaVideo /> Visio</> : <><FaMapMarkerAlt /> Présentiel</>}</span>
        </div>
        {rdv.note && <p className="rdv-note">📝 {rdv.note}</p>}
        <div className="rdv-actions">
          <a className="mini-btn" href={google(rdv)} target="_blank" rel="noopener noreferrer" title="Ajouter à Google Agenda">
            <FaGoogle /> Google
          </a>
          <button className="mini-btn" onClick={() => ics(rdv)} title="Télécharger .ics (Outlook, Apple…)">
            <FaDownload /> .ics
          </button>
          {waReady && (
            <button className="mini-btn wa" onClick={() => whatsapp(rdv)} title="Confirmer par WhatsApp">
              <FaWhatsapp /> Confirmer
            </button>
          )}
          {rdv.status !== 'confirme' && rdv.status !== 'annule' && (
            <button className="mini-btn ok" onClick={() => onStatus(rdv.id, 'confirme')}><FaCheck /> Confirmé</button>
          )}
          {rdv.status !== 'annule' && (
            <button className="mini-btn ko" onClick={() => onStatus(rdv.id, 'annule')}><FaTimes /> Annuler</button>
          )}
          <button className="mini-btn danger" onClick={() => onRemove(rdv.id)} title="Supprimer"><FaTrash /></button>
        </div>
      </div>
    </div>
  );
}
