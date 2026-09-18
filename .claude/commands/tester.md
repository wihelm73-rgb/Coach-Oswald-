---
description: Lance le projet en local et ouvre un navigateur pour vérifier visuellement une page.
---

## Contexte

```
/tester [page]
```

Arguments bruts : `$ARGUMENTS` — optionnel. Si présent, c'est le libellé ou l'id d'une entrée du
menu (ex: `dashboard`, `Tableaux de Bord`, `offers`, `Offres`...). Si absent, on reste sur la page
d'accueil.

Réutilisable seul (vérification manuelle rapide) ou depuis une autre commande (ex:
`/modifier-texte`) pour la validation visuelle d'un changement.

## Étape 1 — Lancer le projet en local

Vérifie si le serveur de dev tourne déjà sur le port 5173. Si non, démarre-le en arrière-plan
(`npm run dev`) et attends qu'il soit prêt avant de continuer.

## Étape 2 — Ouvrir le navigateur

Ouvre le navigateur (outil Browser) sur `http://localhost:5173`.

Si un `$ARGUMENTS` a été fourni, retrouve l'entrée de menu correspondante dans
`src/components/Sidebar.jsx` (comparaison insensible à la casse sur l'id ou le libellé) et
clique-la pour afficher cette page — l'app n'a pas de routes par URL, tout passe par le menu
latéral. Si aucune entrée ne correspond, indique-le à l'utilisateur et reste sur la page d'accueil.

## Étape 3 — Restituer

Lis le contenu de la page affichée (texte et/ou capture) et présente-le brièvement à l'utilisateur
pour qu'il puisse valider visuellement.

Ne ferme pas le serveur de dev à la fin — laisse-le tourner pour que l'utilisateur puisse continuer
à naviguer lui-même dans le navigateur ouvert, sauf si l'utilisateur demande explicitement de
l'arrêter.
