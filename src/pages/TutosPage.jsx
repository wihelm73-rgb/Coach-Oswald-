import { useMemo } from 'react';
import { FaVideo, FaCalendarAlt } from 'react-icons/fa';
import tutos from '../data/tutos.json';
import './TutosPage.css';

// Référentiel statique (voir src/data/tutos.json) — alimenté par la commande /ajouter-tuto.
// Les fichiers vidéo sont servis depuis public/tutos/ (chemin absolu, non traité par Vite).
export default function TutosPage() {
  const sorted = useMemo(
    () => [...tutos].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)),
    []
  );

  return (
    <div className="tutos-page">
      <div className="tutos-intro">
        <h2><FaVideo /> Tutos vidéo</h2>
        <p className="muted">Les vidéos les plus récentes en premier.</p>
      </div>

      {sorted.length === 0 ? (
        <p className="muted empty">Aucun tuto pour le moment.</p>
      ) : (
        <div className="tutos-grid">
          {sorted.map((t) => (
            <article key={t.id} className="tuto-card">
              <video className="tuto-video" src={t.file} controls preload="metadata" />
              <div className="tuto-body">
                <h3>{t.title}</h3>
                {t.description && <p className="tuto-description">{t.description}</p>}
                <span className="tuto-date">
                  <FaCalendarAlt />
                  {new Date(t.publishedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
