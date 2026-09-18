---
description: Publie les changements en cours sur GitHub (commit + push), sans archive ni déploiement OVH.
---

## Contexte

```
/publier
```

Commande autonome, plus légère que `/deployer` : elle s'arrête après le push GitHub, sans créer
l'archive de production ni déployer sur OVH. Utile pour sauvegarder/partager du code sans pour
autant le mettre en ligne (ex: travail intermédiaire, pas encore validé visuellement).

Exécute les étapes suivantes **dans l'ordre**, sans en sauter aucune. Ne continue jamais après une
étape en échec — signale l'erreur à l'utilisateur et arrête-toi.

## Étape 1 — Résumé et confirmation

Affiche `git status` (fichiers modifiés/non suivis) et `git log -1 --oneline`. Si rien n'est en
attente de commit (working tree propre) **et** que la branche locale n'a rien à pousser (`git
status` ne mentionne aucun "ahead"), informe l'utilisateur qu'il n'y a rien à publier et
arrête-toi.

Sinon, résume en une phrase ce qui va être commité/poussé et demande une confirmation **oui/non**
(AskUserQuestion, réponse binaire) avant de toucher à quoi que ce soit. Si non, arrête-toi.

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

## Étape 3 — Récapitulatif

Termine par un résumé court : message du commit, lien vers le commit GitHub si possible. Rappelle
que l'archive/déploiement OVH n'ont pas été faits — utiliser `/deployer` pour ça si besoin.
