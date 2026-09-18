import { useState, useMemo } from 'react';
import {
  FaHeartbeat, FaDumbbell, FaRunning, FaChild, FaWeight, FaPlus, FaTrash,
  FaChevronDown, FaArrowUp, FaArrowDown, FaMinus, FaChartLine, FaClipboardCheck,
} from 'react-icons/fa';
import './TestsPage.css';

/* =====================================================================
 * RÉFÉRENTIEL DE TESTS PHYSIQUES
 * better : 'up' = plus c'est haut, mieux c'est · 'down' = plus c'est bas, mieux c'est
 * ===================================================================== */
const CATEGORIES = [
  { id: 'cardio', name: 'Endurance & cardio', icon: FaHeartbeat, color: '#FF4757' },
  { id: 'force', name: 'Force', icon: FaDumbbell, color: '#E67E22' },
  { id: 'vitesse', name: 'Vitesse & explosivité', icon: FaRunning, color: '#9B59B6' },
  { id: 'souplesse', name: 'Souplesse & mobilité', icon: FaChild, color: '#2ECC71' },
  { id: 'composition', name: 'Composition corporelle', icon: FaWeight, color: '#D4AF37' },
];

const TESTS = [
  { id: 'cooper', cat: 'cardio', name: 'Test de Cooper (12 min)', unit: 'm', better: 'up', desc: 'Distance parcourue en 12 minutes de course.' },
  { id: 'vma', cat: 'cardio', name: 'VMA', unit: 'km/h', better: 'up', desc: 'Vitesse maximale aérobie (test de demi-Cooper / VAMEVAL).' },
  { id: 'ruffier', cat: 'cardio', name: 'Indice de Ruffier', unit: 'pts', better: 'down', desc: 'Récupération cardiaque après 30 flexions (plus bas = mieux).' },
  { id: 'gainage', cat: 'cardio', name: 'Gainage planche', unit: 'sec', better: 'up', desc: 'Temps de maintien en planche.' },

  { id: 'pompes_max', cat: 'force', name: 'Pompes max', unit: 'reps', better: 'up', desc: 'Nombre maximal de pompes d’affilée.' },
  { id: 'tractions_max', cat: 'force', name: 'Tractions max', unit: 'reps', better: 'up', desc: 'Nombre maximal de tractions strictes.' },
  { id: 'squat_1rm', cat: 'force', name: 'Squat 1RM', unit: 'kg', better: 'up', desc: 'Charge maximale sur une répétition de squat.' },
  { id: 'abdos_1min', cat: 'force', name: 'Abdos en 1 min', unit: 'reps', better: 'up', desc: 'Nombre de redressements assis en 60 secondes.' },

  { id: 'sprint30', cat: 'vitesse', name: 'Sprint 30 m', unit: 'sec', better: 'down', desc: 'Temps sur 30 mètres départ arrêté (plus bas = mieux).' },
  { id: 'detente_v', cat: 'vitesse', name: 'Détente verticale', unit: 'cm', better: 'up', desc: 'Hauteur de saut vertical (test de Sargent).' },
  { id: 'saut_long', cat: 'vitesse', name: 'Saut en longueur sans élan', unit: 'cm', better: 'up', desc: 'Distance de saut pieds joints, départ arrêté.' },

  { id: 'sit_reach', cat: 'souplesse', name: 'Souplesse (flexion buste)', unit: 'cm', better: 'up', desc: 'Test « sit & reach » : distance atteinte mains vers les pieds.' },
  { id: 'epaules', cat: 'souplesse', name: 'Mobilité d’épaules', unit: 'cm', better: 'down', desc: 'Écart entre les mains dans le dos (plus bas = mieux).' },

  { id: 'poids', cat: 'composition', name: 'Poids', unit: 'kg', better: 'down', desc: 'Poids corporel.' },
  { id: 'imc', cat: 'composition', name: 'IMC', unit: '', better: 'down', desc: 'Indice de masse corporelle.' },
  { id: 'taille_tour', cat: 'composition', name: 'Tour de taille', unit: 'cm', better: 'down', desc: 'Tour de taille au niveau du nombril.' },
  { id: 'masse_grasse', cat: 'composition', name: 'Masse grasse', unit: '%', better: 'down', desc: 'Pourcentage de masse grasse estimé.' },
];

const LS_TESTS = 'oswald_tests';
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });

export default function TestsPage() {
  const [results, setResults] = useState(() => loadLS(LS_TESTS, {}));
  const [cat, setCat] = useState('all');

  const persist = (next) => { setResults(next); saveLS(LS_TESTS, next); };
  const addResult = (testId, date, value) => {
    const list = [...(results[testId] || []), { id: uid(), date, value }].sort((a, b) => new Date(a.date) - new Date(b.date));
    persist({ ...results, [testId]: list });
  };
  const removeResult = (testId, rid) =>
    persist({ ...results, [testId]: (results[testId] || []).filter((r) => r.id !== rid) });

  const shownCats = CATEGORIES.filter((c) => cat === 'all' || c.id === cat);
  const evaluatedCount = Object.values(results).filter((l) => l && l.length).length;

  return (
    <div className="tests-page">
      <div className="tests-intro">
        <h2>Tests physiques & évaluations</h2>
        <p className="muted">Suivi des tests de performance, évaluations physiques et résultats.</p>
      </div>

      <div className="tests-stats">
        <span><FaClipboardCheck /> {evaluatedCount} test(s) suivi(s)</span>
        <span><FaChartLine /> {TESTS.length} tests disponibles</span>
      </div>

      <div className="cat-filter">
        <button className={`chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>Tous</button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`chip ${cat === c.id ? 'active' : ''}`}
            onClick={() => setCat(c.id)}
            style={cat === c.id ? { background: c.color, color: '#000', borderColor: 'transparent' } : {}}
          >
            <c.icon /> {c.name}
          </button>
        ))}
      </div>

      {shownCats.map((c) => (
        <div key={c.id} className="test-cat">
          <h3 className="test-cat-title" style={{ borderColor: c.color }}>
            <c.icon style={{ color: c.color }} /> {c.name}
          </h3>
          <div className="test-grid">
            {TESTS.filter((t) => t.cat === c.id).map((t) => (
              <TestCard
                key={t.id}
                test={t}
                color={c.color}
                results={results[t.id] || []}
                onAdd={addResult}
                onRemove={removeResult}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestCard({ test, color, results, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [value, setValue] = useState('');

  const { last, evolution } = useMemo(() => {
    if (!results.length) return { last: null, evolution: null };
    const first = results[0];
    const lastR = results[results.length - 1];
    if (results.length < 2) return { last: lastR, evolution: null };
    const diff = lastR.value - first.value;
    const improved = test.better === 'up' ? diff > 0 : diff < 0;
    const pct = first.value !== 0 ? Math.round((diff / Math.abs(first.value)) * 100) : 0;
    return { last: lastR, evolution: { diff: Math.round(diff * 100) / 100, pct, improved, neutral: diff === 0 } };
  }, [results, test.better]);

  const submit = (e) => {
    e.preventDefault();
    if (value === '') return;
    onAdd(test.id, date, Number(value));
    setValue('');
  };

  const vals = results.map((r) => r.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const norm = (v) => (max === min ? 60 : 12 + ((v - min) / (max - min)) * 88);

  return (
    <div className={`test-card ${open ? 'open' : ''}`}>
      <div className="test-card-head">
        <div className="test-title-block">
          <span className="test-name">{test.name}</span>
          <span className="test-desc">{test.desc}</span>
        </div>
        <div className="test-last">
          {last ? (
            <>
              <span className="test-val" style={{ color }}>{last.value}<small> {test.unit}</small></span>
              <span className="test-val-date">{fmtDate(last.date)}</span>
            </>
          ) : (
            <span className="test-empty">Aucun résultat</span>
          )}
        </div>
      </div>

      <div className="test-card-foot">
        {evolution ? (
          <span className={`evo ${evolution.neutral ? 'neutral' : evolution.improved ? 'up' : 'down'}`}>
            {evolution.neutral ? <FaMinus /> : evolution.improved ? <FaArrowUp /> : <FaArrowDown />}
            {evolution.diff > 0 ? '+' : ''}{evolution.diff} {test.unit} ({evolution.pct > 0 ? '+' : ''}{evolution.pct}%)
          </span>
        ) : (
          <span className="evo neutral">{results.length === 1 ? '1 mesure' : 'Pas encore de suivi'}</span>
        )}
        <button className="toggle-btn" onClick={() => setOpen(!open)}>
          {open ? 'Fermer' : 'Détails'} <FaChevronDown className={open ? 'rot' : ''} />
        </button>
      </div>

      {open && (
        <div className="test-detail">
          {results.length > 0 && (
            <div className="test-chart">
              {results.map((r) => (
                <div key={r.id} className="tc-col" title={`${r.value} ${test.unit} — ${fmtDate(r.date)}`}>
                  <div className="tc-bar" style={{ height: `${norm(r.value)}%`, background: color }} />
                  <span className="tc-x">{fmtDate(r.date)}</span>
                </div>
              ))}
            </div>
          )}

          <form className="test-add" onSubmit={submit}>
            <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
            <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Valeur (${test.unit || 'nombre'})`} required />
            <button type="submit"><FaPlus /> Ajouter</button>
          </form>

          {results.length > 0 && (
            <ul className="test-history">
              {[...results].reverse().map((r) => (
                <li key={r.id}>
                  <span>{fmtDate(r.date)}</span>
                  <strong>{r.value} {test.unit}</strong>
                  <button onClick={() => onRemove(test.id, r.id)} title="Supprimer"><FaTrash /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
