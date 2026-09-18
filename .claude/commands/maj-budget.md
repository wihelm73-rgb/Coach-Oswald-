---
description: Ajoute une nouvelle section datée dans BUDGET_TRACKING.md pour la session en cours.
---

## Contexte

```
/maj-budget
```

Aucun argument. Applique la règle « Suivi du budget — OBLIGATOIRE » définie dans `CLAUDE.md` : à
la fin d'une session de travail, `BUDGET_TRACKING.md` doit être mis à jour avec une nouvelle
section datée. Cette commande automatise cette mise à jour à partir du travail réellement effectué
dans **cette conversation**.

Respecte le format déjà en place dans `BUDGET_TRACKING.md` — reprends-le à l'identique (mêmes
titres, mêmes tableaux, mêmes émojis), ne le réinvente pas.

## Étape 1 — Déterminer le numéro de session et la date

Lis `BUDGET_TRACKING.md` : repère le plus grand `Session N` existant → la nouvelle section sera
`Session N+1`. Récupère la date du jour (contexte système `currentDate`, format `AAAA-MM-JJ`).

## Étape 2 — Résumer le travail de la session

Fais la liste de ce qui a été réellement fait **dans cette conversation** (pas de git log générique
ni d'invention) : fichiers créés/modifiés, fonctionnalités ajoutées, commandes créées, bugs
corrigés, décisions prises. Recoupe si besoin avec `git status` / `git diff --stat` pour ne rien
oublier, mais la source de vérité est ce qui s'est passé dans l'échange avec l'utilisateur.

Regroupe par thème avec des puces `✅ **Titre** :` suivies de sous-puces, à l'image des sessions
précédentes. Ne mentionne jamais le nom du modèle d'IA utilisé (règle du projet).

## Étape 3 — Estimer durée et tokens

Donne une estimation de durée (plage, ex. `~40-50 min`) et de tokens utilisés (ex. `~90,000
(estimation)`), et un coût approximatif cohérent avec les sessions précédentes (règle de
proportion : regarde le rapport tokens/coût des sessions existantes pour rester cohérent). Précise
toujours qu'il s'agit d'estimations — jamais de chiffres présentés comme exacts.

## Étape 4 — Insérer la nouvelle section

Insère un nouveau bloc juste après le tableau « 📊 Récapitulatif cumulé » et avant la section de
l'ancienne dernière session (donc en tête de liste, sessions du plus récent au plus ancien) :

```
# 🗓️ Session N — AAAA-MM-JJ

## 📊 Session Overview

| Métrique | Valeur |
|----------|--------|
| **Date** | AAAA-MM-JJ |
| **Durée** | ~XX-YY min |
| **Tokens Utilisés** | ~XXX,000 (estimation) |

## 💵 Coûts Financiers

| Élément | Coût |
|--------|------|
| **Coût Total Session** | **~€X.XX** (estimation) |

## ✅ Ce qui a été réalisé

- ✅ ...

---
```

## Étape 5 — Mettre à jour le récapitulatif cumulé

Dans le tableau en haut de fichier : incrémente `Sessions`, additionne la durée et les tokens à la
plage/estimation cumulée existante, additionne le coût. Garde le formatage `(estimation)` partout
où c'est déjà le cas.

## Étape 6 — Mettre à jour le pied de page

Remplace la ligne `**Dernière mise à jour**: ...` (dernière ligne du fichier) par une ligne du même
format, avec la nouvelle date, session, durée, coût et un résumé très court (quelques mots) du
travail principal de la session.

## Étape 7 — Récapitulatif

Confirme à l'utilisateur que `BUDGET_TRACKING.md` a été mis à jour, en rappelant le numéro de
session ajouté et le résumé en une phrase.
