import { useState, useEffect } from 'react';
import {
  FaFileInvoiceDollar, FaCreditCard, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
  FaDownload, FaPlus, FaMinus, FaWallet, FaLock, FaSpinner, FaUniversity, FaReceipt,
} from 'react-icons/fa';
import './BillingPage.css';

/* =====================================================================
 * CONFIGURATION FACTURATION — PAIEMENTS BOUCHONNÉS (MOCK)
 * MOCK_MODE = true : aucune transaction réelle, paiement simulé.
 * L'intégration Crédit Agricole (e-Transactions / API) sera branchée ici.
 * ===================================================================== */
const MOCK_MODE = true;
const BANK = {
  nom: 'Crédit Agricole',
  solution: 'e-Transactions',
  carteMasquee: '**** **** **** 4067',
};

/* Packs rechargeables (séances) */
const PACKS = [
  { id: 'p1', label: 'Séance à l’unité', seances: 1, montant: 50 },
  { id: 'p5', label: 'Pack 5 séances', seances: 5, montant: 235 },
  { id: 'p10', label: 'Pack 10 séances', seances: 10, montant: 450 },
];

const LS_BILLING = 'oswald_billing';
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const euro = (n) => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

/* État initial de démonstration (première visite) */
const seedState = () => ({
  forfait: { achetees: 10, consommees: 3 },
  invoices: [
    { id: uid(), libelle: 'Pack 10 séances', montant: 450, date: '2026-05-20T10:00:00', statut: 'payee', moyen: BANK.nom },
    { id: uid(), libelle: 'Séance individuelle', montant: 50, date: '2026-06-10T18:00:00', statut: 'en_attente', moyen: null },
  ],
});

const STATUTS = {
  payee: { label: 'Payée', cls: 'pay', icon: FaCheckCircle },
  en_attente: { label: 'En attente', cls: 'wait', icon: FaHourglassHalf },
  echec: { label: 'Échec', cls: 'fail', icon: FaTimesCircle },
};

export default function BillingPage() {
  const [state, setState] = useState(() => loadLS(LS_BILLING, seedState()));
  const [pay, setPay] = useState(null); // facture en cours de paiement (modal)

  useEffect(() => { saveLS(LS_BILLING, state); }, [state]);

  const { forfait, invoices } = state;
  const restantes = Math.max(0, forfait.achetees - forfait.consommees);
  const totalPaye = invoices.filter((i) => i.statut === 'payee').reduce((s, i) => s + i.montant, 0);
  const totalAttente = invoices.filter((i) => i.statut === 'en_attente').reduce((s, i) => s + i.montant, 0);

  const decompter = (delta) =>
    setState((s) => ({
      ...s,
      forfait: { ...s.forfait, consommees: Math.min(s.forfait.achetees, Math.max(0, s.forfait.consommees + delta)) },
    }));

  const acheterPack = (pack) => {
    const facture = { id: uid(), libelle: pack.label, montant: pack.montant, seances: pack.seances, date: new Date().toISOString(), statut: 'en_attente', moyen: null };
    setState((s) => ({ ...s, invoices: [facture, ...s.invoices] }));
    setPay(facture); // ouvre directement le paiement
  };

  /* Paiement bouchonné : simulation d'un encaissement Crédit Agricole */
  const confirmerPaiement = (facture) =>
    setState((s) => ({
      ...s,
      forfait: facture.seances
        ? { ...s.forfait, achetees: s.forfait.achetees + facture.seances }
        : s.forfait,
      invoices: s.invoices.map((i) => (i.id === facture.id ? { ...i, statut: 'payee', moyen: BANK.nom } : i)),
    }));

  const telechargerRecu = (f) => {
    const txt = [
      'COACH OSWALD — REÇU DE PAIEMENT (DÉMONSTRATION)',
      '----------------------------------------------',
      `Facture : ${f.libelle}`,
      `Montant : ${euro(f.montant)}`,
      `Date    : ${fmtDate(f.date)}`,
      `Statut  : ${STATUTS[f.statut].label}`,
      `Moyen   : ${f.moyen || '—'}`,
      '',
      'Document de démonstration — aucune valeur comptable.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = `recu-${f.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="billing-page">
      <div className="billing-intro">
        <h2>Facturation & paiement</h2>
        <p className="muted">Gestion des paiements, décompte des séances et intégration {BANK.nom}.</p>
      </div>

      {MOCK_MODE && (
        <div className="mock-banner">
          <FaLock /> <strong>Mode démonstration</strong> — paiements simulés via {BANK.nom} ({BANK.solution}).
          Aucune transaction réelle n'est effectuée.
        </div>
      )}

      {/* KPI */}
      <div className="kpi-row">
        <div className="kpi">
          <FaWallet className="kpi-ic" />
          <span className="kpi-num">{restantes}</span>
          <span className="kpi-lbl">Séances restantes</span>
        </div>
        <div className="kpi">
          <FaCheckCircle className="kpi-ic green" />
          <span className="kpi-num">{euro(totalPaye)}</span>
          <span className="kpi-lbl">Total réglé</span>
        </div>
        <div className="kpi">
          <FaHourglassHalf className="kpi-ic orange" />
          <span className="kpi-num">{euro(totalAttente)}</span>
          <span className="kpi-lbl">En attente</span>
        </div>
      </div>

      <div className="billing-grid">
        {/* Décompte des séances */}
        <section className="panel">
          <h3><FaReceipt /> Décompte des séances</h3>
          <div className="forfait-bar">
            <div className="forfait-fill" style={{ width: `${forfait.achetees ? (forfait.consommees / forfait.achetees) * 100 : 0}%` }} />
          </div>
          <p className="forfait-txt">
            <strong>{forfait.consommees}</strong> consommées sur <strong>{forfait.achetees}</strong> ·
            <strong className="hl"> {restantes} restantes</strong>
          </p>
          <div className="counter">
            <button className="counter-btn" onClick={() => decompter(-1)} disabled={forfait.consommees <= 0}><FaMinus /></button>
            <span>Pointer une séance</span>
            <button className="counter-btn" onClick={() => decompter(1)} disabled={restantes <= 0}><FaPlus /></button>
          </div>

          <h4 className="recharge-title">Recharger des séances</h4>
          <div className="pack-list">
            {PACKS.map((p) => (
              <button key={p.id} className="pack-btn" onClick={() => acheterPack(p)}>
                <span className="pack-name">{p.label}</span>
                <span className="pack-sub">+{p.seances} séance(s)</span>
                <span className="pack-price">{euro(p.montant)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Factures */}
        <section className="panel">
          <h3><FaFileInvoiceDollar /> Mes factures</h3>
          {invoices.length === 0 ? (
            <p className="muted">Aucune facture.</p>
          ) : (
            <div className="invoice-list">
              {invoices.map((f) => {
                const st = STATUTS[f.statut];
                const StIcon = st.icon;
                return (
                  <div key={f.id} className="invoice-row">
                    <div className="invoice-main">
                      <span className="invoice-lbl">{f.libelle}</span>
                      <span className="invoice-date">{fmtDate(f.date)}{f.moyen ? ` · ${f.moyen}` : ''}</span>
                    </div>
                    <span className="invoice-amount">{euro(f.montant)}</span>
                    <span className={`invoice-status ${st.cls}`}><StIcon /> {st.label}</span>
                    <div className="invoice-actions">
                      {f.statut === 'en_attente' ? (
                        <button className="pay-btn" onClick={() => setPay(f)}><FaCreditCard /> Payer</button>
                      ) : (
                        <button className="ghost-btn" onClick={() => telechargerRecu(f)} title="Télécharger le reçu"><FaDownload /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {pay && (
        <PaymentModal
          facture={pay}
          onClose={() => setPay(null)}
          onPaid={(f) => { confirmerPaiement(f); setPay(null); }}
        />
      )}
    </div>
  );
}

/* ---------- Modal de paiement bouchonné (Crédit Agricole) ---------- */
function PaymentModal({ facture, onClose, onPaid }) {
  const [phase, setPhase] = useState('form'); // form | processing | done

  const lancer = () => {
    setPhase('processing');
    setTimeout(() => setPhase('done'), 1600); // simulation de l'encaissement
  };

  return (
    <div className="modal-overlay" onClick={phase === 'processing' ? undefined : onClose}>
      <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pay-head">
          <FaUniversity /> {BANK.nom} · {BANK.solution}
          <span className="sandbox">SANDBOX</span>
        </div>

        {phase === 'form' && (
          <>
            <p className="pay-amount-line">Montant à régler</p>
            <p className="pay-amount">{euro(facture.montant)}</p>
            <p className="pay-sub">{facture.libelle}</p>

            <div className="card-mock">
              <div className="card-field"><label>Numéro de carte</label><div className="card-val">{BANK.carteMasquee}</div></div>
              <div className="card-field-row">
                <div className="card-field"><label>Expiration</label><div className="card-val">12 / 28</div></div>
                <div className="card-field"><label>CVV</label><div className="card-val">•••</div></div>
              </div>
            </div>

            <p className="pay-note"><FaLock /> Paiement simulé — aucune carte réelle n'est débitée.</p>
            <div className="pay-actions">
              <button className="ghost-btn" onClick={onClose}>Annuler</button>
              <button className="confirm-btn" onClick={lancer}><FaLock /> Payer {euro(facture.montant)}</button>
            </div>
          </>
        )}

        {phase === 'processing' && (
          <div className="pay-center">
            <FaSpinner className="spin" />
            <p>Connexion au serveur {BANK.nom}…</p>
            <p className="muted">Traitement du paiement</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="pay-center">
            <FaCheckCircle className="ok-big" />
            <p className="pay-ok">Paiement accepté</p>
            <p className="muted">{euro(facture.montant)} · {facture.libelle}</p>
            <button className="confirm-btn" onClick={() => onPaid(facture)}>Terminer</button>
          </div>
        )}
      </div>
    </div>
  );
}
