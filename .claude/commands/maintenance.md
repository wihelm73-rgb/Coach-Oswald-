---
description: Active la page de maintenance sur l'hébergement OVH.
---

## Contexte

```
/maintenance
```

Bascule le site en ligne vers la page « Site en maintenance »
([public/maintenance.html](../../public/maintenance.html)) : envoie ce fichier en tant que
`index.html` sur l'hébergement OVH, sans toucher au reste des fichiers déjà en ligne.
Contrairement à `/deployer`, cette commande ne touche pas à GitHub — c'est un toggle rapide côté
hébergement uniquement.

Il n'y a pas de commande "off" séparée : pour revenir au site normal, `/deployer` (ou
`npm run deploy:ovh`) republie le vrai build par-dessus la page de maintenance.

Exécute les étapes suivantes **dans l'ordre**, sans en sauter aucune. Ne continue jamais après une
étape en échec — signale l'erreur à l'utilisateur et arrête-toi.

## Étape 1 — Vérifier la configuration

Vérifie que `.env` contient `OVH_HOST`, `OVH_USER`, `OVH_PASSWORD`, `OVH_REMOTE_PATH` (et
`OVH_PROTOCOL`, `ftp` par défaut). S'ils manquent, arrête-toi et demande à l'utilisateur de
compléter `.env` à partir de `.env.example` — ne devine jamais ces valeurs.

## Étape 2 — Confirmation

Action outward-facing sur le site en production : résume ce qui va se passer (« le site en ligne
va afficher une page de maintenance à la place du site actuel ») et demande une confirmation
**oui/non** (AskUserQuestion) avant de toucher à quoi que ce soit. Si non, arrête-toi.

## Étape 3 — Activer

Exécute `npm run maintenance:on` et vérifie que le script se termine sans erreur.

## Étape 4 — Récapitulatif

Confirme à l'utilisateur que la page de maintenance est en ligne, et rappelle que `/deployer`
permet de revenir au site normal.
