# Déploiement — Coach Oswald

## Netlify

- **Dashboard du projet** : https://app.netlify.com/projects/celebrated-crepe-5d194e/overview
- **Dépôt source** : https://github.com/julienminfo/oswald.git

## Build

- Commande de build : `npm run build`
- Dossier de sortie : `dist/`

## OVH — déploiement de l'archive de production

Paramètres à renseigner dans un fichier `.env` local (jamais commité — voir `.env.example`) :
`GITHUB_TOKEN`, `OVH_PROTOCOL` (`ftp` ou `sftp`), `OVH_HOST`, `OVH_PORT`, `OVH_USER`,
`OVH_PASSWORD`, `OVH_REMOTE_PATH`.

- `npm run archive` → build + zip de `dist/` dans `releases/coach-oswald-<horodatage>.zip`
  (non commité, sert d'historique/rollback local).
- `npm run deploy:ovh` → build (si besoin) puis envoi du contenu de `dist/` sur l'hébergement OVH
  via FTP ou SFTP selon `OVH_PROTOCOL`.
- `npm run maintenance:on` → envoie [public/maintenance.html](public/maintenance.html) en tant que
  `index.html` sur l'hébergement OVH, sans toucher au reste des fichiers déjà en ligne. Pour
  revenir au site normal, relancer `npm run deploy:ovh` (réécrase `index.html` avec le vrai build)
  — pas de script "off" séparé.

## Commandes Claude Code (administrateur)

Ces commandes personnalisées vivent dans `.claude/commands/` (versionnées avec ce dépôt). Claude
Code les charge depuis le dossier `.claude/` **du répertoire dans lequel la session est lancée** —
il faut donc démarrer Claude Code avec la racine de ce dépôt comme répertoire courant pour
qu'elles soient reconnues.

- `/tester [page]` → lance `npm run dev` si besoin et ouvre un navigateur sur la page indiquée.
- `/modifier-texte [TEXTE_ORIGINE] -> [TEXTE_CIBLE]` → localise le texte, demande confirmation de
  la page concernée, modifie le code, appelle `/tester` pour validation visuelle, puis — après
  validation — publie sur GitHub, crée l'archive et déploie sur OVH (via `/deployer`).
- `/publier` → commit + push GitHub uniquement (token depuis `.env`), sans archive ni déploiement
  OVH — pour sauvegarder/partager du code pas encore prêt à être mis en ligne.
- `/deployer` → publie sur GitHub, crée l'archive (`npm run archive`) et déploie sur OVH
  (`npm run deploy:ovh`), pour publier des changements déjà validés sans repasser par
  `/modifier-texte`.
- `/ajouter-tuto [CHEMIN_VIDEO] | [TITRE] | [DESCRIPTION] | [DATE]` → copie une vidéo locale dans
  `public/tutos/`, l'enregistre dans `src/data/tutos.json`, valide visuellement (page « Tutos
  vidéo », réservée aux utilisateurs connectés) puis publie/déploie (via `/deployer`).
- `/maj-budget` → ajoute une nouvelle section datée dans `BUDGET_TRACKING.md` avec le travail
  effectué durant la session.
- `/maintenance` → affiche la page « en maintenance » sur le site en ligne (OVH uniquement, sans
  passer par GitHub). Pas de commande "off" séparée : `/deployer` republie le vrai site.
