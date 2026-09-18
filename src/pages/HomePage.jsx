import logoImage from '../assets/coach-oswald-logo.png';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Présentation de l'application */}
      <section className="app-presentation">
        <div className="logo-container">
          <img 
            src={logoImage} 
            alt="COACH OSWALD" 
            className="page-logo"
          />
        </div>
        <div className="welcome-text">
          <h2>Bienvenue à Coach Oswald</h2>
          <p>
            Votre plateforme complète de suivi de coaching en ligne. 
            Accédez à vos programmes, suivez votre progression et communiquez directement avec votre coach.
          </p>
        </div>
      </section>

      {/* Guidage pas à pas */}
      <section className="guidance-section">
        <h3>📋 Guide de démarrage pour les clients</h3>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Consultez vos Programmes</h4>
            <p>Accédez à vos programmes d'entraînement personnalisés dans la section "Programmes".</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Suivez vos Séances</h4>
            <p>Consultez les séances, exercices avec visuels et animations adaptés à votre niveau.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Visualisez votre Progression</h4>
            <p>Suivez vos progrès et vos records personnels dans le tableau de bord.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Communiquez avec votre Coach</h4>
            <p>Envoyez des messages, posez des questions via la messagerie ou organisez une visio.</p>
          </div>
        </div>
      </section>

      {/* Présentation du Coach */}
      <section className="coach-presentation">
        <h3>👨‍🏫 Votre Coach</h3>
        <div className="coach-card">
          <div className="coach-info">
            <h4>Oswald Amah</h4>
            <p className="coach-title">Expert en Performance Executive & Préparation Mentale pour Dirigeants</p>
            <blockquote className="coach-quote">
              « Ce qui vous semble impossible aujourd'hui deviendra votre routine. »
            </blockquote>

            <div className="coach-bio-block">
              <h5>Le profil & l'élite sportive</h5>
              <p className="coach-description">
                Diplômé d'État (BPJEPS Pugiliste des sports de contact et disciplines associées) et fort de
                40 ans d'expérience et d'exigence dans l'univers des sports de contact pieds-poings, Oswald
                Amah incarne l'excellence au service du leadership. Son expertise unique repose sur la
                performance absolue de ses deux titres consécutifs de Champion de France en Kick-Boxing
                (1999 et 2000). Cette maîtrise du plus haut niveau lui permet de transposer avec précision les
                clés de la réussite sportive à l'univers de la haute direction d'entreprise.
              </p>
              <p className="coach-description">
                Depuis décembre 2016, son organisation accompagne exclusivement une clientèle sélective de
                dirigeants, entrepreneurs et hauts potentiels (30-55 ans). Conscient que la gouvernance exige
                la même endurance, la même clarté stratégique et la même résilience qu'un combat mondial,
                Oswald propose une méthodologie premium et hautement confidentielle, opérée exclusivement en
                distanciel live.
              </p>
            </div>

            <div className="coach-bio-block">
              <h5>L'approche stratégique : haute performance globale</h5>
              <p className="coach-description">
                Loin des programmes de fitness conventionnels, cette méthode sur-mesure s'intègre de manière
                fluide dans les agendas ultra-complexes des leaders. Sans impact physique direct, le
                protocole repose sur une synergie rigoureuse combinant la précision technique du Kick-Boxing,
                l'intensité du travail cardio, et la puissance des exercices isométriques.
              </p>
              <div className="coach-pillars">
                <div className="coach-pillar">
                  <h6>Pilier Physique : Puissance & Silhouette</h6>
                  <p>
                    Optimisation du tonus musculaire, de l'explosivité et de l'agilité. Une véritable
                    transformation de la silhouette axée sur le dynamisme et le remodelage athlétique pour
                    incarner pleinement votre leadership.
                  </p>
                </div>
                <div className="coach-pillar">
                  <h6>Pilier Mental : Résilience & Focus</h6>
                  <p>
                    Développement d'une force mentale d'élite. Clarté décisionnelle sous haute pression,
                    gestion absolue du stress quotidien, lâcher-prise contrôlé et alignement psychologique
                    total.
                  </p>
                </div>
              </div>
            </div>

            <div className="coach-services">
              <h5>Pourquoi cet accompagnement est unique ?</h5>
              <ul>
                <li>
                  <strong>Ancrage Historique & Confiance :</strong> un savoir-faire éprouvé depuis 2016
                  spécifiquement auprès de l'écosystème des chefs d'entreprise et des comités de direction.
                </li>
                <li>
                  <strong>Format Distanciel Live d'Élite :</strong> une flexibilité totale pour vous
                  entraîner depuis votre bureau, votre domicile ou lors de vos déplacements internationaux,
                  sans aucune rupture de rythme.
                </li>
                <li>
                  <strong>Philosophie de Parité :</strong> une approche moderne, exigeante et sur-mesure,
                  rigoureusement adaptée aux attentes des dirigeants et dirigeantes d'affaires.
                </li>
                <li>
                  <strong>Optimisation de Capital :</strong> un investissement haut de gamme pensé pour
                  sécuriser votre santé, maximiser votre lucidité stratégique et pérenniser vos performances
                  de leadership (programmes annuels de 15k€ à 40k€).
                </li>
              </ul>
            </div>

            <p className="coach-footer-note">
              Programmes d'Accompagnement Annuels sur Mesure • Accès Privé & Sécurisé
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <button className="cta-button">
          Commencer mon Parcours
        </button>
      </section>
    </div>
  );
}
