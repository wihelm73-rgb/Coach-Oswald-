export default function ComingSoon({ title, description }) {
  return (
    <div className="page-content coming-soon">
      <div className="coming-soon-container">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <div className="coming-soon-icon">🚀</div>
        <p className="coming-soon-text">Contenu à venir...</p>
      </div>
    </div>
  );
}
