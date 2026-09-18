import { useState, useMemo, useEffect } from 'react';
import {
  FaDumbbell, FaStopwatch, FaWallet, FaCalendarCheck, FaBullseye, FaFire,
  FaPlus, FaTrash, FaMinus, FaChartBar, FaRegCalendarAlt, FaTrophy,
} from 'react-icons/fa';
import './DashboardPage.css';

/* ---------- lecture des données des autres modules ---------- */
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const LS_DASH = 'oswald_dashboard';

/* Lundi de la semaine d'une date (clé ISO) */
const mondayOf = (d) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0 = lundi
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const seedDash = () => ({
  weekStart: mondayOf(new Date()).toISOString(),
  goals: [
    { id: uid(), label: 'Séances ce mois', current: 0, target: 12, unit: 'séances' },
    { id: uid(), label: 'Poids cible atteint', current: 2, target: 5, unit: 'kg' },
    { id: uid(), label: 'Litres d’eau / jour', current: 1.5, target: 2, unit: 'L' },
  ],
  habits: [
    { id: uid(), label: 'Entraînement', days: [false, false, false, false, false, false, false] },
    { id: uid(), label: 'Étirements', days: [false, false, false, false, false, false, false] },
    { id: uid(), label: '8 000 pas', days: [false, false, false, false, false, false, false] },
  ],
});

export default function DashboardPage() {
  const [dash, setDash] = useState(() => loadLS(LS_DASH, seedDash()));
  const [newGoal, setNewGoal] = useState('');
  const [newHabit, setNewHabit] = useState('');

  /* Données agrégées (lecture seule) des autres modules */
  const sessions = loadLS('oswald_sessions', []);
  const rdvs = loadLS('oswald_rdv', []);
  const billing = loadLS('oswald_billing', { forfait: { achetees: 0, consommees: 0 }, invoices: [] });

  /* Réinitialisation hebdomadaire des habitudes */
  useEffect(() => {
    const currentMonday = mondayOf(new Date()).toISOString();
    if (dash.weekStart !== currentMonday) {
      setDash((d) => ({
        ...d,
        weekStart: currentMonday,
        habits: d.habits.map((h) => ({ ...h, days: [false, false, false, false, false, false, false] })),
      }));
    }
  }, []); // eslint-disable-line

  useEffect(() => { saveLS(LS_DASH, dash); }, [dash]);

  /* ---------- KPI ---------- */
  const totalSeances = sessions.length;
  const totalMinutes = sessions.reduce((t, s) => t + (s.durationMin || 0), 0);
  const seancesRestantes = Math.max(0, (billing.forfait?.achetees || 0) - (billing.forfait?.consommees || 0));

  const nextRdv = useMemo(() => {
    const now = new Date();
    return rdvs
      .filter((r) => r.status !== 'annule' && new Date(`${r.date}T${r.time}:00`) >= now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0];
  }, [rdvs]);

  /* ---------- Progression : séances par semaine (8 dernières) ---------- */
  const weekly = useMemo(() => {
    const weeks = [];
    const base = mondayOf(new Date());
    for (let i = 7; i >= 0; i--) {
      const start = new Date(base);
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const count = sessions.filter((s) => {
        const d = new Date(s.date);
        return d >= start && d < end;
      }).length;
      weeks.push({ label: start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), count });
    }
    return weeks;
  }, [sessions]);
  const maxWeek = Math.max(...weekly.map((w) => w.count), 1);

  /* ---------- Activité récente ---------- */
  const activity = useMemo(() => {
    const evts = [];
    sessions.forEach((s) => evts.push({ date: s.date, icon: '🏋️', text: `Séance « ${s.programName} » terminée` }));
    rdvs.forEach((r) => evts.push({ date: `${r.date}T${r.time}:00`, icon: '📅', text: `RDV ${r.status === 'annule' ? 'annulé' : 'planifié'}` }));
    (billing.invoices || []).filter((i) => i.statut === 'payee').forEach((i) => evts.push({ date: i.date, icon: '💳', text: `Paiement réglé — ${i.libelle}` }));
    return evts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [sessions, rdvs, billing]);

  /* ---------- Mutations objectifs / habitudes ---------- */
  const adjustGoal = (id, delta) =>
    setDash((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, current: Math.max(0, Math.round((g.current + delta) * 10) / 10) } : g)) }));
  const setGoalTarget = (id, target) =>
    setDash((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, target: Math.max(1, target) } : g)) }));
  const removeGoal = (id) => setDash((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setDash((d) => ({ ...d, goals: [...d.goals, { id: uid(), label: newGoal.trim(), current: 0, target: 10, unit: '' }] }));
    setNewGoal('');
  };

  const toggleHabit = (id, day) =>
    setDash((d) => ({ ...d, habits: d.habits.map((h) => (h.id === id ? { ...h, days: h.days.map((v, i) => (i === day ? !v : v)) } : h)) }));
  const removeHabit = (id) => setDash((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setDash((d) => ({ ...d, habits: [...d.habits, { id: uid(), label: newHabit.trim(), days: [false, false, false, false, false, false, false] }] }));
    setNewHabit('');
  };

  const fmtRdv = nextRdv
    ? new Date(`${nextRdv.date}T${nextRdv.time}:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }) + ` · ${nextRdv.time}`
    : '—';

  return (
    <div className="dash-page">
      <div className="dash-intro">
        <h2>Tableau de bord</h2>
        <p className="muted">Statistiques, suivi des objectifs, habitudes et progressions.</p>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <Kpi icon={<FaDumbbell />} num={totalSeances} label="Séances réalisées" color="#FF6B35" />
        <Kpi icon={<FaStopwatch />} num={`${totalMinutes} min`} label="Temps d'effort" color="#D4AF37" />
        <Kpi icon={<FaWallet />} num={seancesRestantes} label="Séances restantes" color="#2ecc71" />
        <Kpi icon={<FaCalendarCheck />} num={fmtRdv} label="Prochain RDV" color="#9B59B6" small />
      </div>

      <div className="dash-grid">
        {/* Progression */}
        <section className="dash-panel wide">
          <h3><FaChartBar /> Progression — séances par semaine</h3>
          {totalSeances === 0 ? (
            <p className="muted empty">Aucune séance enregistrée. Lancez un programme pour voir votre progression ici.</p>
          ) : (
            <div className="week-chart">
              {weekly.map((w, i) => (
                <div key={i} className="week-col" title={`${w.count} séance(s)`}>
                  <div className="week-bar-wrap">
                    <div className="week-bar" style={{ height: `${(w.count / maxWeek) * 100}%` }}>
                      {w.count > 0 && <span className="week-val">{w.count}</span>}
                    </div>
                  </div>
                  <span className="week-x">{w.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Objectifs */}
        <section className="dash-panel">
          <h3><FaBullseye /> Mes objectifs</h3>
          <div className="goal-list">
            {dash.goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              const done = pct >= 100;
              return (
                <div key={g.id} className="goal">
                  <div className="goal-head">
                    <span className="goal-label">{done && <FaTrophy className="trophy" />} {g.label}</span>
                    <button className="x-btn" onClick={() => removeGoal(g.id)}><FaTrash /></button>
                  </div>
                  <div className="goal-bar"><div className={`goal-fill ${done ? 'done' : ''}`} style={{ width: `${pct}%` }} /></div>
                  <div className="goal-foot">
                    <div className="goal-counter">
                      <button onClick={() => adjustGoal(g.id, -0.5)}><FaMinus /></button>
                      <span>{g.current}</span>
                      <button onClick={() => adjustGoal(g.id, 0.5)}><FaPlus /></button>
                      <span className="goal-sep">/</span>
                      <input type="number" min={1} value={g.target} onChange={(e) => setGoalTarget(g.id, Number(e.target.value))} />
                      <span className="goal-unit">{g.unit}</span>
                    </div>
                    <span className={`goal-pct ${done ? 'done' : ''}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="add-row" onSubmit={addGoal}>
            <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Nouvel objectif…" />
            <button type="submit"><FaPlus /></button>
          </form>
        </section>

        {/* Habitudes */}
        <section className="dash-panel">
          <h3><FaFire /> Habitudes de la semaine</h3>
          <div className="habit-head"><span /><div className="habit-days">{JOURS.map((j, i) => <span key={i}>{j}</span>)}</div></div>
          <div className="habit-list">
            {dash.habits.map((h) => {
              const streak = h.days.filter(Boolean).length;
              return (
                <div key={h.id} className="habit">
                  <span className="habit-label">{h.label} <span className="streak"><FaFire /> {streak}/7</span></span>
                  <div className="habit-days">
                    {h.days.map((v, i) => (
                      <button key={i} className={`day-dot ${v ? 'on' : ''}`} onClick={() => toggleHabit(h.id, i)} aria-label={`jour ${i + 1}`} />
                    ))}
                  </div>
                  <button className="x-btn" onClick={() => removeHabit(h.id)}><FaTrash /></button>
                </div>
              );
            })}
          </div>
          <form className="add-row" onSubmit={addHabit}>
            <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="Nouvelle habitude…" />
            <button type="submit"><FaPlus /></button>
          </form>
        </section>

        {/* Activité récente */}
        <section className="dash-panel wide">
          <h3><FaRegCalendarAlt /> Activité récente</h3>
          {activity.length === 0 ? (
            <p className="muted empty">Vos dernières séances, RDV et paiements apparaîtront ici.</p>
          ) : (
            <ul className="activity">
              {activity.map((a, i) => (
                <li key={i}>
                  <span className="act-ic">{a.icon}</span>
                  <span className="act-text">{a.text}</span>
                  <span className="act-date">{new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Kpi({ icon, num, label, color, small }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      <div className="kpi-body">
        <span className={`kpi-value ${small ? 'sm' : ''}`}>{num}</span>
        <span className="kpi-label">{label}</span>
      </div>
    </div>
  );
}
