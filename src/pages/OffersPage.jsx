import { FaRegStar, FaChartLine, FaClipboardList } from 'react-icons/fa';
import './OffersPage.css';

/* =====================================================================
 * CONFIGURATION DES OFFRES — À PERSONNALISER PAR LE COACH
 * ===================================================================== */

/* Protocoles d'accompagnement Executive (programmes annuels premium) */
const EXECUTIVE_PROTOCOLS = [
  {
    id: 'elite-rituels',
    name: 'Le Protocole Élite Rituels',
    subtitle: 'Optimisation flash haute fréquence',
    duration: '13 semaines',
    rhythm: 'Rythme : 15 minutes • 5 fois par semaine',
    durationLabel: 'Durée : 1 trimestre (13 semaines)',
    description:
      "Un format ultra-intensif quotidien conçu pour les agendas en flux tendu. Ce protocole agit comme un catalyseur d'énergie matinal ou un reset de focus entre deux conseils d'administration, permettant de maintenir un niveau de vigilance et de tonicité maximal.",
    phases: [
      { phase: 'Échauffement', detail: "Inclus et calibré pour l'activation neuromusculaire immédiate." },
      { phase: 'Corps de séance', detail: '5 séries de haute intensité de 2 minutes.' },
      { phase: 'Récupération', detail: 'Micro-pauses de 30 secondes (hydratation et recentrage) entre chaque série.' },
      { phase: 'Retour au calme', detail: '2 minutes 30 secondes dédiées à la baisse du rythme cardiaque et à la clarté mentale.' },
    ],
    followUp:
      "1 point d'analyse de performance à chaque fin de semaine pour ajuster les charges de travail physiologiques et mentales.",
  },
  {
    id: 'clarte-endurance',
    name: 'Le Protocole Clarté & Endurance',
    subtitle: 'Ancrage profond & résilience executive',
    duration: '26 semaines',
    rhythm: 'Rythme : 30 minutes • 3 fois par semaine',
    durationLabel: 'Durée : 1 semestre (26 semaines)',
    description:
      "Un programme de fond pensé pour bâtir une endurance executive à toute épreuve et remodeler la silhouette de manière structurelle. Ce protocole semestriel permet d'installer des habitudes de performance durables et une résistance supérieure au stress de haute gouvernance.",
    phases: [
      { phase: 'Échauffement', detail: 'Inclus et optimisé pour la transition dynamique vers l’effort.' },
      { phase: 'Corps de séance', detail: '7 séries de 3 minutes + 1 série finale de 2 minutes 30 secondes (focus technique / cardio + exercices isométriques).' },
      { phase: 'Récupération', detail: "8 micro-pauses d'hydratation de 30 secondes précisément chronométrées entre les blocs." },
      { phase: 'Retour au calme', detail: '2 minutes 30 secondes de récupération active et d’alignement psychologique.' },
    ],
    followUp:
      "1 point d'analyse de performance à chaque fin de semaine pour corréler la forme physique avec vos impératifs décisionnels.",
  },
];

export default function OffersPage({ onSelectProtocol }) {
  return (
    <div className="offers-page">
      <div className="offers-intro">
        <h2>Nos offres de coaching</h2>
        <p className="muted">Découvrez nos protocoles d'accompagnement, conçus pour les dirigeants et décideurs.</p>
      </div>

      {/* ---- Protocoles Executive ---- */}
      <section className="offers-section">
        <h3 className="offers-section-title"><FaChartLine /> Protocoles d'Accompagnement Executive</h3>
        <p className="muted executive-intro">
          Ingénierie de la performance pour dirigeants & décideurs. Chaque protocole est conçu pour s'intégrer
          de manière millimétrée dans les agendas complexes des hauts dirigeants, opéré exclusivement en
          distanciel live.
        </p>
        <div className="executive-grid">
          {EXECUTIVE_PROTOCOLS.map((p) => (
            <div key={p.id} className="executive-card">
              <span className="executive-duration-badge">{p.duration}</span>
              <div className="executive-body">
                <h4>{p.name}</h4>
                <p className="executive-subtitle">{p.subtitle}</p>
                <p className="executive-rhythm">{p.rhythm} <span className="sep">|</span> {p.durationLabel}</p>
                <p className="executive-description">{p.description}</p>

                <table className="executive-table">
                  <thead>
                    <tr>
                      <th>Phase de séance</th>
                      <th>Structure du protocole</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.phases.map((ph, i) => (
                      <tr key={i}>
                        <td>{ph.phase}</td>
                        <td>{ph.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="executive-followup"><strong>Suivi stratégique :</strong> {p.followUp}</p>
              </div>

              <button className="offer-cta executive-cta" onClick={() => onSelectProtocol?.(p.id)}>
                <FaClipboardList /> Demander ce protocole
              </button>
            </div>
          ))}
        </div>
        <p className="executive-footnote">Programmes d'accompagnement annuels sur mesure • Accès privé & sécurisé</p>
      </section>

      <p className="offers-footnote">
        <FaRegStar /> Détails et conditions dans les <strong>CGV/CGU</strong>.
      </p>
    </div>
  );
}
