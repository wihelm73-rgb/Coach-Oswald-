---
description: Remplace un texte du site (avec confirmations), publie sur GitHub et déploie sur OVH.
---

## Contexte

L'administrateur (non-développeur) invoque cette commande ainsi :

```
/modifier-texte [TEXTE_ORIGINE] -> [TEXTE_CIBLE]
```

Arguments bruts : `$ARGUMENTS`

Extrais `TEXTE_ORIGINE` et `TEXTE_CIBLE` en coupant sur le séparateur `->` (retire les espaces et
crochets `[ ]` éventuels autour de chaque partie). Si le format n'est pas respecté (pas de `->`,
ou une des deux parties vide), arrête-toi et demande à l'utilisateur de reformuler.

Exécute ensuite **scrupuleusement et dans l'ordre** les étapes suivantes. Ne passe jamais à l'étape
suivante sans validation explicite de l'utilisateur quand elle est demandée — un silence ou une
réponse ambiguë n'est pas un "oui".

## Étape 1 — Localiser le texte

Cherche `TEXTE_ORIGINE` (occurrence exacte, chaîne littérale) dans `src/` avec Grep (exclure
`node_modules`, `dist`, `releases`).

- **0 occurrence** : indique-le à l'utilisateur et arrête-toi (rien à modifier).
- **1 occurrence** : continue à l'étape 2 sans demander de confirmation sur le nombre d'occurrences.
- **2 occurrences ou plus** : c'est **obligatoire** de lister chaque occurrence (fichier + ligne +
  extrait) et de demander explicitement à l'utilisateur, avant toute modification, s'il faut :
  (a) toutes les remplacer, (b) seulement certaines (préciser lesquelles), ou (c) annuler.
  N'en modifie aucune avant d'avoir sa réponse.

## Étape 2 — Confirmer la page concernée

Pour chaque fichier identifié à l'étape 1, déduis la page utilisateur concernée (regarde à quel
`case` de `src/App.jsx` / quelle entrée de `src/components/Sidebar.jsx` correspond ce composant —
ex: `src/pages/OffersPage.jsx` → page « Offres »). Annonce à l'utilisateur, en une phrase claire,
la ou les pages où le texte va être modifié, et demande une confirmation **oui/non** (utilise
AskUserQuestion, réponse binaire, pas de question ouverte). Si la réponse est non, arrête-toi.

## Étape 3 — Modifier le texte

Une fois confirmé, remplace `TEXTE_ORIGINE` par `TEXTE_CIBLE` dans chaque fichier retenu (Edit),
en préservant exactement la casse, la ponctuation et le balisage JSX autour du texte — ne change
rien d'autre sur la ligne.

## Étape 4 — Lancer et valider visuellement

Applique les étapes de la commande `/tester` (`.claude/commands/tester.md`) avec comme argument la
page identifiée à l'étape 2 : lancement du serveur de dev si besoin, ouverture du navigateur,
navigation jusqu'à cette page. Vérifie ensuite que le nouveau texte s'affiche correctement.

Demande alors à l'utilisateur de valider ce qu'il voit dans le navigateur : **oui/non**
(AskUserQuestion, réponse binaire). Si non : propose d'annuler la modification (`git checkout` du
fichier concerné) ou de recommencer, selon ce que l'utilisateur souhaite — puis arrête-toi.

## Étape 5 — Publier et déployer

Si validé, arrête le serveur de dev, puis commit les fichiers modifiés à l'étape 3 avec un message
du type `Texte : remplace « TEXTE_ORIGINE » par « TEXTE_CIBLE » (page X)`.

Enchaîne ensuite avec les étapes 2 à 4 de la commande `/deployer` (push GitHub avec
`GITHUB_TOKEN`, création de l'archive via `npm run archive`, déploiement OVH via
`npm run deploy:ovh`) — sans redemander de confirmation générale, la validation visuelle de
l'étape 4 ci-dessus en tenant lieu.

## Étape 6 — Récapitulatif

Termine par un résumé court : texte remplacé, page(s) concernée(s), commit poussé (lien vers le
commit GitHub si possible), archive créée, statut du déploiement OVH.
