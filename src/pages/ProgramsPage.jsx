import { useState, useMemo } from 'react';
import {
  FaDumbbell, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaPlay, FaSave,
  FaCheck, FaTimes, FaPen, FaHistory, FaChartLine, FaBook, FaClipboardList,
  FaSearch, FaStopwatch, FaRoute, FaRedo
} from 'react-icons/fa';
import data from '../data/exercises.json';
import './ProgramsPage.css';

const { muscleGroups, exercises } = data;
const exById = Object.fromEntries(exercises.map((e) => [e.id, e]));
const mgById = Object.fromEntries(muscleGroups.map((m) => [m.id, m]));

const LS_PROGRAMS = 'oswald_programs';
const LS_SESSIONS = 'oswald_sessions';

/* ---------- helpers stockage ---------- */
const loadLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota dépassé : on ignore silencieusement */
  }
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- formatage ---------- */
const fmtDuration = (s) => {
  if (s == null) return '–';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m} min${sec ? ` ${sec}s` : ''}` : `${sec}s`;
};
const fmtDistance = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

const fmtTarget = (item) => {
  const sets = item.sets ?? 1;
  if (item.type === 'duree') return `${sets} × ${fmtDuration(item.duration)}`;
  if (item.type === 'distance') return fmtDistance(item.distance ?? 0);
  return `${sets} × ${item.reps ?? 0} reps`;
};

/* Crée une ligne d'exercice (dans un programme) à partir du référentiel */
const makeProgramItem = (ex) => ({
  key: uid(),
  exerciseId: ex.id,
  type: ex.type,
  sets: ex.defaultSets ?? 1,
  reps: ex.defaultReps ?? null,
  duration: ex.defaultDuration ?? null,
  distance: ex.defaultDistance ?? null,
  weight: null,
  rest: 60,
});

export default function ProgramsPage() {
  const [view, setView] = useState('programs'); // programs | library | history
  const [programs, setPrograms] = useState(() => loadLS(LS_PROGRAMS, []));
  const [sessions, setSessions] = useState(() => loadLS(LS_SESSIONS, []));

  const [editing, setEditing] = useState(null); // programme en cours d'édition
  const [activeSession, setActiveSession] = useState(null); // séance en cours

  const persistPrograms = (next) => {
    setPrograms(next);
    saveLS(LS_PROGRAMS, next);
  };
  const persistSessions = (next) => {
    setSessions(next);
    saveLS(LS_SESSIONS, next);
  };

  /* ---------- séance en cours ---------- */
  if (activeSession) {
    return (
      <SessionRunner
        session={activeSession}
        onCancel={() => setActiveSession(null)}
        onFinish={(finished) => {
          persistSessions([finished, ...sessions]);
          setActiveSession(null);
          setView('history');
        }}
      />
    );
  }

  /* ---------- éditeur de programme ---------- */
  if (editing) {
    return (
      <ProgramEditor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSave={(prog) => {
          const exists = programs.some((p) => p.id === prog.id);
          persistPrograms(exists ? programs.map((p) => (p.id === prog.id ? prog : p)) : [prog, ...programs]);
          setEditing(null);
        }}
      />
    );
  }

  const startSession = (program) => {
    setActiveSession({
      id: uid(),
      programId: program.id,
      programName: program.name,
      date: new Date().toISOString(),
      startedAt: Date.now(),
      items: program.exercises.map((it) => ({
        ...it,
        done: false,
        actual: {
          sets: it.sets,
          reps: it.reps,
          duration: it.duration,
          distance: it.distance,
          weight: it.weight,
        },
      })),
      notes: '',
    });
  };

  return (
    <div className="programs-page">
      <div className="prog-tabs">
        <button className={`prog-tab ${view === 'programs' ? 'active' : ''}`} onClick={() => setView('programs')}>
          <FaClipboardList /> Mes programmes
        </button>
        <button className={`prog-tab ${view === 'library' ? 'active' : ''}`} onClick={() => setView('library')}>
          <FaBook /> Bibliothèque <span className="badge">{exercises.length}</span>
        </button>
        <button className={`prog-tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <FaChartLine /> Suivi & progression
        </button>
      </div>

      <div className="prog-body">
        {view === 'programs' && (
          <ProgramsList
            programs={programs}
            sessions={sessions}
            onNew={() =>
              setEditing({ id: uid(), name: '', description: '', createdAt: new Date().toISOString(), exercises: [] })
            }
            onEdit={(p) => setEditing(p)}
            onDelete={(id) => persistPrograms(programs.filter((p) => p.id !== id))}
            onStart={startSession}
            onDuplicate={(p) =>
              persistPrograms([
                { ...p, id: uid(), name: `${p.name} (copie)`, createdAt: new Date().toISOString(), exercises: p.exercises.map((e) => ({ ...e, key: uid() })) },
                ...programs,
              ])
            }
          />
        )}
        {view === 'library' && <Library />}
        {view === 'history' && (
          <HistoryView sessions={sessions} onDelete={(id) => persistSessions(sessions.filter((s) => s.id !== id))} />
        )}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* Liste des programmes                                                   */
/* ====================================================================== */
function ProgramsList({ programs, sessions, onNew, onEdit, onDelete, onStart, onDuplicate }) {
  return (
    <div>
      <div className="section-head">
        <h2>Mes programmes d'entraînement</h2>
        <button className="btn btn-primary" onClick={onNew}>
          <FaPlus /> Nouveau programme
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="empty-state">
          <FaDumbbell className="empty-icon" />
          <p>Aucun programme pour le moment.</p>
          <p className="muted">Créez votre premier programme à partir de la bibliothèque de {exercises.length} exercices.</p>
          <button className="btn btn-primary" onClick={onNew}>
            <FaPlus /> Créer un programme
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {programs.map((p) => {
            const count = sessions.filter((s) => s.programId === p.id).length;
            return (
              <div key={p.id} className="program-card">
                <div className="program-card-head">
                  <h3>{p.name || 'Sans titre'}</h3>
                  <span className="pill">{p.exercises.length} ex.</span>
                </div>
                {p.description && <p className="muted">{p.description}</p>}
                <ul className="mini-list">
                  {p.exercises.slice(0, 4).map((it) => (
                    <li key={it.key}>
                      <span>{exById[it.exerciseId]?.name ?? it.exerciseId}</span>
                      <span className="muted">{fmtTarget(it)}</span>
                    </li>
                  ))}
                  {p.exercises.length > 4 && <li className="muted">+ {p.exercises.length - 4} autre(s)…</li>}
                </ul>
                <p className="muted small">{count} séance(s) réalisée(s)</p>
                <div className="program-card-actions">
                  <button className="btn btn-primary" disabled={!p.exercises.length} onClick={() => onStart(p)}>
                    <FaPlay /> Démarrer
                  </button>
                  <button className="btn" onClick={() => onEdit(p)} title="Modifier">
                    <FaPen />
                  </button>
                  <button className="btn" onClick={() => onDuplicate(p)} title="Dupliquer">
                    <FaRedo />
                  </button>
                  <button className="btn btn-danger" onClick={() => onDelete(p.id)} title="Supprimer">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ====================================================================== */
/* Éditeur de programme                                                   */
/* ====================================================================== */
function ProgramEditor({ initial, onCancel, onSave }) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [items, setItems] = useState(initial.exercises);
  const [pickerMuscle, setPickerMuscle] = useState('all');
  const [pickerSearch, setPickerSearch] = useState('');

  const move = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= items.length) return;
    const next = [...items];
    [next[idx], next[ni]] = [next[ni], next[idx]];
    setItems(next);
  };
  const remove = (key) => setItems(items.filter((i) => i.key !== key));
  const update = (key, patch) => setItems(items.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const add = (ex) => setItems([...items, makeProgramItem(ex)]);

  const filtered = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    return exercises.filter((e) => {
      const okMuscle = pickerMuscle === 'all' || e.muscles.includes(pickerMuscle);
      const okSearch = !q || e.name.toLowerCase().includes(q);
      return okMuscle && okSearch;
    });
  }, [pickerMuscle, pickerSearch]);

  const canSave = name.trim() && items.length > 0;

  return (
    <div className="programs-page">
      <div className="section-head">
        <h2>{initial.name ? 'Modifier le programme' : 'Nouveau programme'}</h2>
        <div className="row-gap">
          <button className="btn" onClick={onCancel}>
            <FaTimes /> Annuler
          </button>
          <button
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() => onSave({ ...initial, name: name.trim(), description: description.trim(), exercises: items })}
          >
            <FaSave /> Enregistrer
          </button>
        </div>
      </div>

      <div className="editor-grid">
        {/* Colonne gauche : composition du programme */}
        <div className="editor-main">
          <div className="field">
            <label>Nom du programme</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Full body débutant" />
          </div>
          <div className="field">
            <label>Description (optionnel)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Objectif, fréquence…" />
          </div>

          <h3 className="block-title">Exercices ({items.length})</h3>
          {items.length === 0 && <p className="muted">Ajoutez des exercices depuis la bibliothèque à droite →</p>}

          <div className="item-list">
            {items.map((it, idx) => {
              const ex = exById[it.exerciseId];
              const mg = mgById[ex?.primaryMuscle];
              return (
                <div key={it.key} className="item-row">
                  <div className="item-order">
                    <button className="icon-btn" disabled={idx === 0} onClick={() => move(idx, -1)} title="Monter">
                      <FaArrowUp />
                    </button>
                    <span className="order-num">{idx + 1}</span>
                    <button className="icon-btn" disabled={idx === items.length - 1} onClick={() => move(idx, 1)} title="Descendre">
                      <FaArrowDown />
                    </button>
                  </div>

                  <div className="item-info">
                    <div className="item-name">{ex?.name ?? it.exerciseId}</div>
                    {mg && (
                      <span className="muscle-tag" style={{ background: mg.color }}>
                        {mg.icon} {mg.name}
                      </span>
                    )}
                  </div>

                  <div className="item-params">
                    {it.type !== 'distance' && (
                      <NumField label="Séries" value={it.sets} onChange={(v) => update(it.key, { sets: v })} min={1} />
                    )}
                    {it.type === 'reps' && (
                      <NumField label="Reps" value={it.reps} onChange={(v) => update(it.key, { reps: v })} min={1} />
                    )}
                    {it.type === 'duree' && (
                      <NumField label="Durée (s)" value={it.duration} onChange={(v) => update(it.key, { duration: v })} min={5} step={5} />
                    )}
                    {it.type === 'distance' && (
                      <NumField label="Distance (m)" value={it.distance} onChange={(v) => update(it.key, { distance: v })} min={50} step={50} />
                    )}
                    <NumField label="Charge (kg)" value={it.weight} onChange={(v) => update(it.key, { weight: v })} min={0} step={0.5} optional />
                    <NumField label="Repos (s)" value={it.rest} onChange={(v) => update(it.key, { rest: v })} min={0} step={5} />
                  </div>

                  <button className="icon-btn danger" onClick={() => remove(it.key)} title="Retirer">
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne droite : sélecteur d'exercices */}
        <div className="editor-picker">
          <h3 className="block-title">Bibliothèque</h3>
          <div className="search-box">
            <FaSearch />
            <input placeholder="Rechercher un exercice…" value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} />
          </div>
          <div className="muscle-filter">
            <button className={`chip ${pickerMuscle === 'all' ? 'active' : ''}`} onClick={() => setPickerMuscle('all')}>
              Tous
            </button>
            {muscleGroups.map((m) => (
              <button
                key={m.id}
                className={`chip ${pickerMuscle === m.id ? 'active' : ''}`}
                onClick={() => setPickerMuscle(m.id)}
                style={pickerMuscle === m.id ? { background: m.color, color: '#000' } : {}}
              >
                {m.icon} {m.name}
              </button>
            ))}
          </div>
          <div className="picker-list">
            {filtered.map((ex) => {
              const mg = mgById[ex.primaryMuscle];
              return (
                <button key={ex.id} className="picker-item" onClick={() => add(ex)} title="Ajouter au programme">
                  <span className="dot" style={{ background: mg?.color }} />
                  <span className="picker-name">{ex.name}</span>
                  <FaPlus className="picker-add" />
                </button>
              );
            })}
            {filtered.length === 0 && <p className="muted">Aucun exercice trouvé.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange, min = 0, step = 1, optional = false }) {
  return (
    <label className="num-field">
      <span>{label}</span>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        step={step}
        placeholder={optional ? '–' : ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
      />
    </label>
  );
}

/* ====================================================================== */
/* Bibliothèque (regroupée par muscle)                                    */
/* ====================================================================== */
function Library() {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('all');

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return muscleGroups
      .filter((m) => muscle === 'all' || m.id === muscle)
      .map((m) => ({
        ...m,
        items: exercises.filter(
          (e) => e.primaryMuscle === m.id && (!q || e.name.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [search, muscle]);

  return (
    <div>
      <div className="section-head">
        <h2>Bibliothèque d'exercices</h2>
        <div className="search-box">
          <FaSearch />
          <input placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="muscle-filter">
        <button className={`chip ${muscle === 'all' ? 'active' : ''}`} onClick={() => setMuscle('all')}>
          Tous ({exercises.length})
        </button>
        {muscleGroups.map((m) => (
          <button
            key={m.id}
            className={`chip ${muscle === m.id ? 'active' : ''}`}
            onClick={() => setMuscle(m.id)}
            style={muscle === m.id ? { background: m.color, color: '#000' } : {}}
          >
            {m.icon} {m.name}
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <div key={g.id} className="muscle-group">
          <h3 className="muscle-group-title" style={{ borderColor: g.color }}>
            <span style={{ color: g.color }}>{g.icon}</span> {g.name}
            <span className="count">{g.items.length}</span>
          </h3>
          <div className="ex-grid">
            {g.items.map((ex) => (
              <div key={ex.id} className="ex-card">
                <div className="ex-card-head">
                  <span className="ex-name">{ex.name}</span>
                  <span className={`diff diff-${ex.difficulty}`}>{ex.difficulty}</span>
                </div>
                <p className="muted small">{ex.description}</p>
                <div className="ex-meta">
                  <span><FaDumbbell /> {ex.equipment.replace(/_/g, ' ')}</span>
                  <span>
                    {ex.type === 'reps' && <><FaRedo /> {ex.defaultSets}×{ex.defaultReps}</>}
                    {ex.type === 'duree' && <><FaStopwatch /> {fmtDuration(ex.defaultDuration)}</>}
                    {ex.type === 'distance' && <><FaRoute /> {fmtDistance(ex.defaultDistance)}</>}
                  </span>
                </div>
                <div className="ex-muscles">
                  {ex.muscles.map((mid) => (
                    <span key={mid} className="muscle-tag mini" style={{ background: mgById[mid]?.color }}>
                      {mgById[mid]?.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ====================================================================== */
/* Séance en cours                                                        */
/* ====================================================================== */
function SessionRunner({ session, onCancel, onFinish }) {
  const [items, setItems] = useState(session.items);
  const [notes, setNotes] = useState(session.notes);

  const toggle = (i) => setItems(items.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));
  const setActual = (i, patch) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, actual: { ...it.actual, ...patch } } : it)));

  const doneCount = items.filter((i) => i.done).length;
  const progress = Math.round((doneCount / items.length) * 100);

  const finish = () => {
    const durationMin = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000));
    onFinish({
      id: session.id,
      programId: session.programId,
      programName: session.programName,
      date: session.date,
      durationMin,
      notes,
      items: items.map(({ key, exerciseId, type, done, actual }) => ({ key, exerciseId, type, done, actual })),
    });
  };

  return (
    <div className="programs-page">
      <div className="section-head">
        <h2>
          Séance : {session.programName}
        </h2>
        <div className="row-gap">
          <button className="btn" onClick={onCancel}>
            <FaTimes /> Abandonner
          </button>
          <button className="btn btn-primary" onClick={finish}>
            <FaCheck /> Terminer la séance
          </button>
        </div>
      </div>

      <div className="session-progress">
        <div className="bar"><div className="bar-fill" style={{ width: `${progress}%` }} /></div>
        <span>{doneCount}/{items.length} exercices ({progress}%)</span>
      </div>

      <div className="item-list">
        {items.map((it, i) => {
          const ex = exById[it.exerciseId];
          return (
            <div key={it.key} className={`session-row ${it.done ? 'done' : ''}`}>
              <button className={`check-btn ${it.done ? 'on' : ''}`} onClick={() => toggle(i)} title="Marquer comme fait">
                <FaCheck />
              </button>
              <div className="item-info">
                <div className="item-name">{i + 1}. {ex?.name ?? it.exerciseId}</div>
                <span className="muted small">Objectif : {fmtTarget(it)}</span>
              </div>
              <div className="item-params">
                {it.type !== 'distance' && (
                  <NumField label="Séries" value={it.actual.sets} onChange={(v) => setActual(i, { sets: v })} min={0} />
                )}
                {it.type === 'reps' && (
                  <NumField label="Reps" value={it.actual.reps} onChange={(v) => setActual(i, { reps: v })} min={0} />
                )}
                {it.type === 'duree' && (
                  <NumField label="Durée (s)" value={it.actual.duration} onChange={(v) => setActual(i, { duration: v })} min={0} step={5} />
                )}
                {it.type === 'distance' && (
                  <NumField label="Distance (m)" value={it.actual.distance} onChange={(v) => setActual(i, { distance: v })} min={0} step={50} />
                )}
                <NumField label="Charge (kg)" value={it.actual.weight} onChange={(v) => setActual(i, { weight: v })} min={0} step={0.5} optional />
              </div>
            </div>
          );
        })}
      </div>

      <div className="field">
        <label>Notes de séance</label>
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sensations, fatigue, douleurs…" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* Historique & progression                                               */
/* ====================================================================== */
const sessionVolume = (s) =>
  s.items.reduce((tot, it) => {
    if (!it.done) return tot;
    const a = it.actual || {};
    if (it.type === 'reps') return tot + (a.sets || 0) * (a.reps || 0) * (a.weight || 1);
    if (it.type === 'duree') return tot + (a.sets || 1) * (a.duration || 0);
    if (it.type === 'distance') return tot + (a.distance || 0);
    return tot;
  }, 0);

function HistoryView({ sessions, onDelete }) {
  const [exFilter, setExFilter] = useState('all');

  const stats = useMemo(() => {
    const total = sessions.length;
    const totalMin = sessions.reduce((t, s) => t + (s.durationMin || 0), 0);
    const totalExDone = sessions.reduce((t, s) => t + s.items.filter((i) => i.done).length, 0);
    return { total, totalMin, totalExDone };
  }, [sessions]);

  // Exercices apparus dans l'historique (pour le filtre de progression)
  const trackedExercises = useMemo(() => {
    const set = new Set();
    sessions.forEach((s) => s.items.forEach((i) => i.done && set.add(i.exerciseId)));
    return [...set].map((id) => exById[id]).filter(Boolean);
  }, [sessions]);

  // Progression d'un exercice : performance par séance (chronologique)
  const progression = useMemo(() => {
    if (exFilter === 'all') return [];
    const points = [];
    [...sessions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((s) => {
        const it = s.items.find((i) => i.exerciseId === exFilter && i.done);
        if (!it) return;
        const a = it.actual || {};
        let value = 0;
        let label = '';
        if (it.type === 'reps') {
          value = (a.sets || 0) * (a.reps || 0) * (a.weight || 1);
          label = a.weight ? `${a.sets}×${a.reps} @ ${a.weight}kg` : `${a.sets}×${a.reps}`;
        } else if (it.type === 'duree') {
          value = (a.sets || 1) * (a.duration || 0);
          label = `${a.sets || 1}×${fmtDuration(a.duration)}`;
        } else {
          value = a.distance || 0;
          label = fmtDistance(a.distance || 0);
        }
        points.push({ date: s.date, value, label });
      });
    return points;
  }, [exFilter, sessions]);

  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <FaHistory className="empty-icon" />
        <p>Aucune séance enregistrée.</p>
        <p className="muted">Démarrez un programme pour commencer à suivre votre progression.</p>
      </div>
    );
  }

  const maxVal = Math.max(...progression.map((p) => p.value), 1);

  return (
    <div>
      <h2>Suivi & progression</h2>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Séances</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.totalMin}</span>
          <span className="stat-label">Minutes d'effort</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.totalExDone}</span>
          <span className="stat-label">Exercices réalisés</span>
        </div>
      </div>

      {/* Progression par exercice */}
      <div className="prog-block">
        <div className="section-head">
          <h3 className="block-title">Progression par exercice</h3>
          <select value={exFilter} onChange={(e) => setExFilter(e.target.value)} className="select">
            <option value="all">— Choisir un exercice —</option>
            {trackedExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        {exFilter !== 'all' && progression.length > 0 ? (
          <div className="progress-chart">
            {progression.map((p, i) => (
              <div key={i} className="chart-bar-wrap" title={`${new Date(p.date).toLocaleDateString('fr-FR')} — ${p.label}`}>
                <div className="chart-bar" style={{ height: `${(p.value / maxVal) * 100}%` }} />
                <span className="chart-x">{new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
              </div>
            ))}
          </div>
        ) : exFilter !== 'all' ? (
          <p className="muted">Pas encore de données pour cet exercice.</p>
        ) : (
          <p className="muted">Sélectionnez un exercice pour visualiser son évolution (volume = séries × reps × charge).</p>
        )}
      </div>

      {/* Historique des séances */}
      <h3 className="block-title">Historique des séances</h3>
      <div className="history-list">
        {sessions.map((s) => (
          <div key={s.id} className="history-card">
            <div className="history-head">
              <div>
                <strong>{s.programName}</strong>
                <span className="muted small"> · {new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <button className="icon-btn danger" onClick={() => onDelete(s.id)} title="Supprimer">
                <FaTrash />
              </button>
            </div>
            <div className="history-meta">
              <span><FaStopwatch /> {s.durationMin} min</span>
              <span><FaCheck /> {s.items.filter((i) => i.done).length}/{s.items.length} exercices</span>
              <span><FaChartLine /> volume {Math.round(sessionVolume(s)).toLocaleString('fr-FR')}</span>
            </div>
            <ul className="history-ex">
              {s.items.map((it) => (
                <li key={it.key} className={it.done ? '' : 'skipped'}>
                  {it.done ? <FaCheck className="ok" /> : <FaTimes className="ko" />}
                  {exById[it.exerciseId]?.name ?? it.exerciseId}
                  <span className="muted small"> — {fmtTarget({ type: it.type, ...it.actual })}</span>
                </li>
              ))}
            </ul>
            {s.notes && <p className="muted small note">📝 {s.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
