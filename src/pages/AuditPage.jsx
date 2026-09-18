import { useState } from 'react';
import { FaClipboardList, FaCheckCircle, FaPrint, FaTrash } from 'react-icons/fa';
import './AuditPage.css';

/* =====================================================================
 * AUDIT DE POSITIONNEMENT STRATÉGIQUE
 * Questionnaire de bilan initial rempli par le client avant de démarrer,
 * pour calibrer son protocole (Élite Rituels / Clarté & Endurance).
 * ===================================================================== */
const OBJECTIFS = [
  "Optimisation immédiate du niveau d'énergie et de la vigilance executive.",
  'Remodelage athlétique structurel et tonification de la silhouette.',
  'Développement de la clarté décisionnelle et de la résilience sous pression.',
  'Élimination des tensions physiques et déconnexion mentale contrôlée.',
];

const DEFIS = [
  "Réussir à déconnecter l'esprit après les heures de direction.",
  'Maintenir un niveau de concentration et de focus constant en réunion.',
  'Conserver une endurance physique face aux semaines prolongées.',
];

const PROTOCOLES = [
  { id: 'elite-rituels', label: 'Protocole Élite Rituels', detail: 'Format flash de 15 min | 5 fois par semaine' },
  { id: 'clarte-endurance', label: 'Protocole Clarté & Endurance', detail: 'Format de fond de 30 min | 3 fois par semaine' },
];

const CRENEAUX = [
  { id: 'aube', label: 'Aube / Premier créneau', detail: '06h30 - 08h30' },
  { id: 'debut-matinee', label: 'Début de matinée', detail: '08h30 - 10h30' },
  { id: 'fin-matinee', label: 'Fin de matinée / Pré-déjeuner', detail: '10h30 - 12h30' },
];

const EMPTY_FORM = {
  identite: '',
  responsabilites: '',
  objectifs: [],
  historiqueSport: '',
  conditionPhysique: 5,
  contraintes: '',
  manifestationsStress: '',
  defiPrincipal: '',
  protocole: '',
  creneau: '',
  deplacements: '',
};

const LS_AUDIT = 'oswald_audit';
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export default function AuditPage({ preselectedProtocol }) {
  const saved = loadLS(LS_AUDIT, null);

  const [form, setForm] = useState(() => {
    if (saved) return preselectedProtocol ? { ...saved, protocole: preselectedProtocol } : saved;
    return preselectedProtocol ? { ...EMPTY_FORM, protocole: preselectedProtocol } : EMPTY_FORM;
  });
  const [submitted, setSubmitted] = useState(() => saved !== null && !preselectedProtocol);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleObjectif = (obj) => {
    setForm((f) => {
      const has = f.objectifs.includes(obj);
      if (has) return { ...f, objectifs: f.objectifs.filter((o) => o !== obj) };
      if (f.objectifs.length >= 2) return f;
      return { ...f, objectifs: [...f.objectifs, obj] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLS(LS_AUDIT, form);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setSubmitted(false);
    saveLS(LS_AUDIT, null);
  };

  return (
    <div className="audit-page">
      <div className="audit-intro">
        <h2><FaClipboardList /> Audit de positionnement stratégique</h2>
        <p className="muted">
          Configuration de votre protocole de performance sur-mesure. Ce diagnostic permet de calibrer au
          millimètre vos sessions en distanciel live. En analysant vos indicateurs de charge physique, mentale
          et temporelle, nous structurons un protocole d'entraînement parfaitement synchronisé avec vos
          impératifs de gouvernance.
        </p>
      </div>

      {submitted && (
        <div className="audit-banner">
          <FaCheckCircle /> Votre audit a été enregistré. Votre coach en tiendra compte pour calibrer votre
          protocole.
          <button className="audit-link-btn" onClick={() => setSubmitted(false)}>Modifier mes réponses</button>
        </div>
      )}

      {!submitted && (
        <form className="audit-form" onSubmit={handleSubmit}>
          {/* 1. Profil & alignement executive */}
          <section className="audit-section">
            <h3>1. Profil & alignement executive</h3>

            <label className="audit-field">
              <span>Nom / Prénom / Fonction</span>
              <input
                type="text"
                placeholder="Saisie utilisateur"
                value={form.identite}
                onChange={(e) => update('identite', e.target.value)}
              />
            </label>

            <label className="audit-field">
              <span>Nature de vos responsabilités actuelles</span>
              <small>(ex : phases de négociations intenses, gestion de crise, déplacements fréquents)</small>
              <textarea
                rows={2}
                value={form.responsabilites}
                onChange={(e) => update('responsabilites', e.target.value)}
              />
            </label>

            <div className="audit-field">
              <span>Objectifs prioritaires (2 réponses maximum)</span>
              <div className="audit-checkbox-list">
                {OBJECTIFS.map((obj) => (
                  <label key={obj} className="audit-checkbox">
                    <input
                      type="checkbox"
                      checked={form.objectifs.includes(obj)}
                      onChange={() => toggleObjectif(obj)}
                      disabled={!form.objectifs.includes(obj) && form.objectifs.length >= 2}
                    />
                    {obj}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Condition physique & antécédents */}
          <section className="audit-section">
            <h3>2. Condition physique & antécédents</h3>

            <label className="audit-field">
              <span>Historique dans les sports de contact ou disciplines pieds-poings</span>
              <textarea
                rows={2}
                value={form.historiqueSport}
                onChange={(e) => update('historiqueSport', e.target.value)}
              />
            </label>

            <label className="audit-field">
              <span>Évaluation de votre condition physique actuelle</span>
              <small>Échelle de 1 (Sédentaire) à 10 (Athlète d'élite)</small>
              <div className="audit-range-row">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.conditionPhysique}
                  onChange={(e) => update('conditionPhysique', Number(e.target.value))}
                />
                <span className="audit-range-value">{form.conditionPhysique}</span>
              </div>
            </label>

            <label className="audit-field">
              <span>Contraintes physiologiques ou douleurs récurrentes</span>
              <small>(ex : sensibilité articulaire aux genoux, épaules, dos, poignets)</small>
              <textarea
                rows={2}
                value={form.contraintes}
                onChange={(e) => update('contraintes', e.target.value)}
              />
            </label>
          </section>

          {/* 3. Analyse de la charge mentale & focus */}
          <section className="audit-section">
            <h3>3. Analyse de la charge mentale & focus</h3>

            <label className="audit-field">
              <span>Manifestations majeures du stress de haute gouvernance</span>
              <small>(ex : fatigue décisionnelle, tensions musculaires, perturbations du sommeil)</small>
              <textarea
                rows={2}
                value={form.manifestationsStress}
                onChange={(e) => update('manifestationsStress', e.target.value)}
              />
            </label>

            <div className="audit-field">
              <span>Votre défi principal au quotidien</span>
              <div className="audit-radio-list">
                {DEFIS.map((defi) => (
                  <label key={defi} className="audit-radio">
                    <input
                      type="radio"
                      name="defiPrincipal"
                      checked={form.defiPrincipal === defi}
                      onChange={() => update('defiPrincipal', defi)}
                    />
                    {defi}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Intégration temporelle & logistique */}
          <section className="audit-section">
            <h3>4. Intégration temporelle & logistique</h3>

            <div className="audit-field">
              <span>Protocole sélectionné pour optimiser votre capital temps</span>
              <div className="audit-radio-list">
                {PROTOCOLES.map((p) => (
                  <label key={p.id} className="audit-radio">
                    <input
                      type="radio"
                      name="protocole"
                      checked={form.protocole === p.id}
                      onChange={() => update('protocole', p.id)}
                    />
                    <strong>{p.label}</strong> — {p.detail}
                  </label>
                ))}
              </div>
            </div>

            <div className="audit-rule">
              <strong>Règle de performance & sécurité :</strong> afin de maximiser l'efficacité de vos séances
              et de vous garantir un boost d'énergie optimal pour toute votre journée, les accompagnements
              s'effectuent exclusivement en matinée. Aucune séance n'est assurée en fin de journée afin de
              prévenir tout risque de blessure lié à la fatigue physique et cognitive accumulée durant votre
              activité professionnelle.
            </div>

            <div className="audit-field">
              <span>Sélection de votre créneau préférentiel (matinée uniquement)</span>
              <div className="audit-radio-list">
                {CRENEAUX.map((c) => (
                  <label key={c.id} className="audit-radio">
                    <input
                      type="radio"
                      name="creneau"
                      checked={form.creneau === c.id}
                      onChange={() => update('creneau', c.id)}
                    />
                    {c.label} : {c.detail}
                  </label>
                ))}
              </div>
            </div>

            <label className="audit-field">
              <span>Fréquence de vos déplacements internationaux & décalages horaires</span>
              <textarea
                rows={2}
                value={form.deplacements}
                onChange={(e) => update('deplacements', e.target.value)}
              />
            </label>
          </section>

          <div className="audit-actions">
            <button type="submit" className="audit-submit">Enregistrer mon audit</button>
          </div>

          <p className="audit-footnote">
            <FaPrint /> Document confidentiel • Propriété d'Oswald Amah • Tous droits réservés
          </p>
        </form>
      )}

      {submitted && (
        <button className="audit-reset" onClick={handleReset}>
          <FaTrash /> Réinitialiser mon audit
        </button>
      )}
    </div>
  );
}
