import { useState } from 'react';
import { FaPrint, FaExclamationTriangle, FaFileContract } from 'react-icons/fa';
import './CgvPage.css';

/* =====================================================================
 * INFORMATIONS LÉGALES — À COMPLÉTER PAR LE COACH
 * Remplacez les valeurs « À compléter » par les informations réelles.
 * ===================================================================== */
const LEGAL = {
  raisonSociale: 'Coach Oswald',
  statut: 'À compléter (ex : Entrepreneur individuel / micro-entreprise)',
  siret: 'À compléter',
  adresse: 'À compléter',
  email: 'À compléter',
  telephone: 'À compléter',
  assurance: 'À compléter (assureur RC Pro + n° de contrat)',
  dateMaj: '12 juin 2026',
};

const isTodo = (v) => typeof v === 'string' && v.toLowerCase().startsWith('à compléter');
const Val = ({ children }) =>
  isTodo(children) ? <span className="todo-field">{children}</span> : <strong>{children}</strong>;

/* Articles : id (ancre) + titre + contenu */
const ARTICLES = [
  {
    id: 'mentions',
    title: 'Mentions légales',
    content: (
      <>
        <p>Le présent site et les prestations de coaching sont édités et fournis par :</p>
        <ul className="legal-list">
          <li>Raison sociale : <Val>{LEGAL.raisonSociale}</Val></li>
          <li>Statut juridique : <Val>{LEGAL.statut}</Val></li>
          <li>SIRET : <Val>{LEGAL.siret}</Val></li>
          <li>Adresse : <Val>{LEGAL.adresse}</Val></li>
          <li>E-mail : <Val>{LEGAL.email}</Val></li>
          <li>Téléphone : <Val>{LEGAL.telephone}</Val></li>
          <li>Assurance responsabilité civile professionnelle : <Val>{LEGAL.assurance}</Val></li>
        </ul>
        <p>Ci-après désigné « le Coach » ou « le Prestataire ».</p>
      </>
    ),
  },
  {
    id: 'objet',
    title: 'Article 1 — Objet',
    content: (
      <p>
        Les présentes Conditions Générales de Vente et d'Utilisation (ci-après « CGV/CGU ») régissent la vente
        des prestations de coaching sportif et de remise en forme proposées par le Coach, ainsi que l'utilisation
        de l'application. Toute commande d'une prestation implique l'acceptation pleine et entière des présentes
        CGV/CGU par le client (ci-après « le Client »).
      </p>
    ),
  },
  {
    id: 'offres',
    title: 'Article 2 — Offres et tarifs',
    content: (
      <>
        <p>
          Les prestations proposées (séances individuelles, programmes personnalisés, accompagnement à distance,
          suivi, etc.) ainsi que leurs tarifs sont décrits dans la rubrique « Offres » de l'application.
        </p>
        <p>
          Les prix sont indiqués en euros. Le Coach se réserve le droit de modifier ses tarifs à tout moment ;
          les prestations sont facturées sur la base des tarifs en vigueur au moment de la commande.
        </p>
      </>
    ),
  },
  {
    id: 'commande',
    title: 'Article 3 — Commande et inscription',
    content: (
      <p>
        La commande est confirmée après validation par le Client de l'offre choisie et, le cas échéant, du
        paiement correspondant. Le Client garantit l'exactitude des informations communiquées lors de son
        inscription. Le Coach se réserve le droit de refuser une demande pour motif légitime.
      </p>
    ),
  },
  {
    id: 'paiement',
    title: 'Article 4 — Modalités de paiement',
    content: (
      <p>
        Le règlement s'effectue selon les modalités indiquées lors de la commande (virement, carte bancaire,
        ou tout autre moyen proposé). Sauf mention contraire, les prestations sont payables d'avance. Un
        justificatif ou une facture est remis au Client sur demande.
      </p>
    ),
  },
  {
    id: 'retractation',
    title: 'Article 5 — Droit de rétractation',
    content: (
      <>
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client particulier
          dispose d'un délai de quatorze (14) jours à compter de la conclusion du contrat pour exercer son droit
          de rétractation, sans avoir à se justifier.
        </p>
        <p>
          Lorsque la prestation est pleinement exécutée avant la fin du délai avec l'accord exprès du Client,
          ou lorsqu'il s'agit de séances à date convenue, le droit de rétractation peut ne pas s'appliquer dans
          les conditions prévues par la loi.
        </p>
      </>
    ),
  },
  {
    id: 'seances',
    title: 'Article 6 — Déroulement, annulation et report des séances',
    content: (
      <>
        <p>
          Les séances sont planifiées d'un commun accord. Toute annulation ou report par le Client doit être
          signalé au moins <strong>24 heures</strong> à l'avance. Passé ce délai, la séance pourra être
          considérée comme due.
        </p>
        <p>
          En cas d'empêchement du Coach, la séance sera reportée à une date convenue ensemble, sans frais pour
          le Client.
        </p>
      </>
    ),
  },
  {
    id: 'sante',
    title: 'Article 7 — Santé et aptitude physique',
    content: (
      <>
        <p>
          Le Client déclare être apte à la pratique d'une activité physique. Il lui appartient de consulter un
          médecin et, si nécessaire, de fournir un <strong>certificat médical de non contre-indication</strong>{' '}
          à la pratique sportive.
        </p>
        <p>
          Le Client s'engage à informer le Coach de tout problème de santé, blessure ou limitation susceptible
          d'affecter la pratique. Le Coach n'est pas un professionnel de santé et ses conseils ne se substituent
          en aucun cas à un avis médical.
        </p>
      </>
    ),
  },
  {
    id: 'obligations-client',
    title: 'Article 8 — Obligations du Client',
    content: (
      <p>
        Le Client s'engage à suivre les consignes de sécurité, à utiliser un matériel adapté, à se présenter
        dans des conditions permettant la pratique (échauffement, hydratation, tenue appropriée) et à adopter
        un comportement respectueux. Le Client reste responsable de l'exécution des exercices en dehors des
        séances encadrées.
      </p>
    ),
  },
  {
    id: 'obligations-coach',
    title: 'Article 9 — Obligations du Coach',
    content: (
      <p>
        Le Coach s'engage à fournir des prestations conformes aux règles de l'art, à adapter l'accompagnement
        aux objectifs et capacités du Client, et à assurer un suivi personnalisé. Le Coach est tenu à une
        obligation de moyens et non de résultat.
      </p>
    ),
  },
  {
    id: 'responsabilite',
    title: 'Article 10 — Responsabilité',
    content: (
      <p>
        La responsabilité du Coach ne saurait être engagée en cas de non-respect des consignes par le Client,
        de fausse déclaration relative à son état de santé, ou de pratique inadaptée en dehors des séances
        encadrées. Le Coach ne peut être tenu responsable des dommages résultant d'un cas de force majeure.
      </p>
    ),
  },
  {
    id: 'donnees',
    title: 'Article 11 — Données personnelles (RGPD)',
    content: (
      <>
        <p>
          Les données personnelles collectées sont utilisées uniquement pour la gestion de la relation
          contractuelle et le suivi des prestations. Elles ne sont ni cédées ni vendues à des tiers.
        </p>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et
          Libertés », le Client dispose d'un droit d'accès, de rectification, d'effacement et d'opposition sur
          ses données, qu'il peut exercer en contactant le Coach à l'adresse <Val>{LEGAL.email}</Val>.
        </p>
      </>
    ),
  },
  {
    id: 'propriete',
    title: 'Article 12 — Propriété intellectuelle',
    content: (
      <p>
        Les programmes, contenus, supports et documents fournis par le Coach sont protégés et demeurent sa
        propriété exclusive. Ils sont destinés à un usage strictement personnel du Client et ne peuvent être
        reproduits, diffusés ou revendus sans autorisation écrite préalable.
      </p>
    ),
  },
  {
    id: 'reclamation',
    title: 'Article 13 — Réclamation et médiation',
    content: (
      <p>
        Toute réclamation peut être adressée au Coach à l'adresse <Val>{LEGAL.email}</Val>. Conformément à la
        réglementation, le Client consommateur peut recourir gratuitement à un médiateur de la consommation en
        vue de la résolution amiable d'un éventuel litige.
      </p>
    ),
  },
  {
    id: 'droit',
    title: 'Article 14 — Droit applicable et juridiction',
    content: (
      <p>
        Les présentes CGV/CGU sont soumises au droit français. À défaut de résolution amiable, tout litige
        relève de la compétence des tribunaux français compétents.
      </p>
    ),
  },
];

export default function CgvPage() {
  const [active, setActive] = useState(ARTICLES[0].id);

  const goTo = (id) => {
    setActive(id);
    document.getElementById(`cgv-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="cgv-page">
      <div className="cgv-warning">
        <FaExclamationTriangle />
        <span>
          Modèle type pour le coaching sportif. À faire valider par un professionnel du droit et à compléter
          avec vos informations légales avant publication.
        </span>
      </div>

      <div className="cgv-layout">
        {/* Sommaire */}
        <aside className="cgv-toc">
          <h3><FaFileContract /> Sommaire</h3>
          <ul>
            {ARTICLES.map((a) => (
              <li key={a.id}>
                <button className={active === a.id ? 'active' : ''} onClick={() => goTo(a.id)}>
                  {a.title}
                </button>
              </li>
            ))}
          </ul>
          <button className="btn-print" onClick={() => window.print()}>
            <FaPrint /> Imprimer / PDF
          </button>
        </aside>

        {/* Contenu */}
        <main className="cgv-content">
          <header className="cgv-header">
            <h2>Conditions Générales de Vente et d'Utilisation</h2>
            <p className="cgv-date">Dernière mise à jour : {LEGAL.dateMaj}</p>
            <p className="muted">
              Consultez nos conditions générales de vente et d'utilisation. En commandant une prestation, vous
              reconnaissez en avoir pris connaissance et les accepter sans réserve.
            </p>
          </header>

          {ARTICLES.map((a) => (
            <section key={a.id} id={`cgv-${a.id}`} className="cgv-article">
              <h3>{a.title}</h3>
              {a.content}
            </section>
          ))}

          <footer className="cgv-footer">
            <p>© {new Date().getFullYear()} {LEGAL.raisonSociale} — Tous droits réservés.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
