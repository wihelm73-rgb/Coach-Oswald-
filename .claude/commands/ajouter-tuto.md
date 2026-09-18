---
description: Ajoute une vidéo tuto (fichier, titre, description, date) à la page « Tutos vidéo ».
---

## Contexte

L'administrateur invoque cette commande ainsi, avec tout ou partie des informations :

```
/ajouter-tuto [CHEMIN_VIDEO] | [TITRE] | [DESCRIPTION] | [DATE_PUBLICATION]
```

Arguments bruts : `$ARGUMENTS` — sépare sur `|`. Chaque partie est optionnelle dans l'appel initial
(l'utilisateur peut n'avoir tapé que `/ajouter-tuto`) : pour toute partie manquante, **demande-la**
plutôt que de deviner — en particulier ne jamais inventer un chemin de fichier, un titre ou une
description.

- `CHEMIN_VIDEO` : chemin local (sur la machine de l'administrateur) vers le fichier vidéo à
  ajouter (`.mp4` recommandé — format le plus compatible navigateur).
- `TITRE` : court, affiché en gras sur la carte.
- `DESCRIPTION` : optionnelle.
- `DATE_PUBLICATION` : format `AAAA-MM-JJ`. Si omise, utilise la date du jour (contexte système
  `currentDate`).

Les vidéos sont stockées **directement dans le projet** (pas de service externe pour l'instant) :
fichiers dans `public/tutos/`, métadonnées dans `src/data/tutos.json`. La page `TutosPage.jsx`
affiche automatiquement les plus récentes en premier — aucune modification de code n'est
nécessaire pour un ajout normal.

## Étape 1 — Vérifier le fichier source

Vérifie que `CHEMIN_VIDEO` existe et est un fichier vidéo (extension `.mp4`, `.webm` ou `.mov`).
Si le chemin n'existe pas ou n'a pas d'extension vidéo reconnue, indique-le à l'utilisateur et
demande un chemin valide — ne continue pas sans fichier confirmé.

Regarde aussi sa taille : au-delà de **50 Mo**, préviens l'utilisateur que committer une vidéo
aussi volumineuse dans le dépôt git va l'alourdir durablement, et demande une confirmation
explicite avant de continuer (il peut aussi choisir de compresser la vidéo avant de relancer la
commande).

## Étape 2 — Copier le fichier dans le projet

Génère un nom de fichier stable à partir du titre (slug : minuscules, accents retirés, espaces →
`-`) suivi d'un court suffixe basé sur la date, par exemple `premiers-pas-2026-08-20.mp4`, pour
éviter toute collision. Copie le fichier source vers `public/tutos/<slug>.<extension>` (ne
déplace/ne supprime jamais le fichier source).

## Étape 3 — Mettre à jour le référentiel

Ajoute une entrée dans `src/data/tutos.json` (Edit — tableau JSON, garder les entrées existantes) :

```json
{
  "id": "<slug>",
  "title": "<TITRE>",
  "description": "<DESCRIPTION ou omis>",
  "publishedAt": "<AAAA-MM-JJ>",
  "file": "/tutos/<slug>.<extension>"
}
```

## Étape 4 — Valider visuellement

Applique les étapes de la commande `/tester` avec `tutos` comme page, pour vérifier que la
nouvelle vidéo apparaît bien en tête de liste (les plus récentes en premier) avec titre,
description et date corrects, et qu'elle se lance dans le lecteur intégré.

Demande à l'utilisateur de confirmer que c'est bon (**oui/non**, AskUserQuestion). Si non, corrige
selon son retour avant de continuer.

## Étape 5 — Publier et déployer

Si validé, enchaîne avec les étapes 2 à 4 de la commande `/deployer` (push GitHub, création de
l'archive, déploiement OVH) — sans redemander de confirmation générale, la validation de l'étape 4
en tenant lieu.

## Étape 6 — Récapitulatif

Termine par un résumé court : titre du tuto ajouté, date de publication, fichier copié, statut de
la publication/déploiement.
