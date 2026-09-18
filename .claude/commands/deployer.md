---
description: Publie les changements en cours sur GitHub, crée l'archive de production et déploie sur OVH.
---

## Contexte

Commande autonome pour publier/déployer l'état actuel du dépôt, sans passer par
`/modifier-texte`. Utile quand des changements sont déjà validés et prêts à partir.

Exécute les étapes suivantes **dans l'ordre**, sans en sauter aucune. Ne continue jamais après une
étape en échec — signale l'erreur à l'utilisateur et arrête-toi.

## Étape 1 — Résumé et confirmation

Affiche `git status` (fichiers modifiés/non suivis) et `git log -1 --oneline`. Si rien n'est en
attente de commit (working tree propre) **et** que la branche locale n'a rien à pousser
(`git status` ne mentionne aucun "ahead"), informe l'utilisateur qu'il n'y a rien à publier et
demande-lui s'il veut tout de même continuer directement sur l'archive + déploiement OVH (étapes
3 et 4) ou arrêter.

Sinon, résume en une phrase ce qui va être commité/poussé et demande une confirmation
**oui/non** (AskUserQuestion, réponse binaire) avant de toucher à quoi que ce soit. Si non,
arrête-toi.

## Étape 2 — Publier sur GitHub

1. `git add -A`.
2. Commit avec un message clair décrivant les changements (pas de message générique type "update").
3. Charge `GITHUB_TOKEN` depuis `.env` (jamais afficher ni logger sa valeur). S'il est absent,
   arrête-toi et demande à l'utilisateur de le renseigner (voir `.env.example`).
4. Pousse en Basic Auth (schéma attendu par un Personal Access Token GitHub — ne pas utiliser
   `Authorization: bearer`, réservé aux tokens éphémères GitHub Actions) :
   ```
   AUTH=$(printf "x-access-token:%s" "$GITHUB_TOKEN" | base64 -w0)
   git -c http.extraheader="Authorization: Basic $AUTH" push origin <branche-courante>
   ```
   Un `401 Unauthorized` de GitHub à cette étape signifie que le token est invalide/expiré ou sans
   le scope `repo` — pas un souci de commande ; demande à l'utilisateur de vérifier/régénérer son
   token plutôt que de retenter la même commande.

## Étape 3 — Créer l'archive de production

Exécute `npm run archive` (build + zip de `dist/` dans `releases/`). Note le chemin de l'archive
produite (dernière ligne affichée par le script).

## Étape 4 — Déployer sur OVH

Vérifie que `.env` contient `OVH_HOST`, `OVH_USER`, `OVH_PASSWORD`, `OVH_REMOTE_PATH` (et
`OVH_PROTOCOL`, `ftp` par défaut). S'ils manquent, arrête-toi et demande à l'utilisateur de
compléter `.env` à partir de `.env.example` — ne devine jamais ces valeurs.

Si tout est présent, exécute `npm run deploy:ovh` et vérifie que le script se termine sans erreur.

## Étape 5 — Récapitulatif

Termine par un résumé court : commit poussé (lien vers le commit GitHub si possible), archive
créée (chemin), statut du déploiement OVH.
