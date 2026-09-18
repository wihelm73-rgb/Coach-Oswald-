# COACH OSWALD - Application Web

Application de suivi et de support coaching en ligne pour Coach Oswald.

## 🎨 Design

- **Couleurs** : Or (#D4AF37), Orange (#FF6B35), Cuivre (#B87333)
- **Layout** : Menu latéral à gauche + contenu principal
- **Style** : Moderne, élégant, intuitif

## 📋 Structure du Projet

```
src/
├── components/
│   └── Sidebar.jsx           # Menu latéral
├── pages/
│   ├── HomePage.jsx          # Page d'accueil
│   ├── DashboardPage.jsx     # Tableau de bord
│   ├── ExercisesPage.jsx     # Bibliothèque d'exercices
│   ├── ProgramsPage.jsx      # Mes programmes
│   ├── MessagesPage.jsx      # Messagerie
│   └── SettingsPage.jsx      # Paramètres
├── assets/
│   └── coach-oswald-logo.svg # Logo (à remplacer par votre PNG)
├── App.jsx                   # Composant principal
├── index.css                 # Styles globaux
└── main.jsx                  # Point d'entrée React
```

## 🚀 Installation & Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

Le navigateur s'ouvrira automatiquement sur `http://localhost:5173`

### 3. Build pour la production
```bash
npm run build
```

## 📝 À Faire Après

1. **Remplacer le logo** : 
   - Remplacez `src/assets/coach-oswald-logo.svg` par votre PNG du logo
   - Mettez à jour les imports si vous utilisez une extension `.png`

2. **Pages à compléter** :
   - Tableau de bord (dashboard)
   - Bibliothèque d'exercices
   - Programmes
   - Messagerie
   - Paramètres

3. **Intégration Backend** (prochainement) :
   - API REST avec Node.js + Express
   - Base de données PostgreSQL
   - Authentification

## 🛠️ Technologies

- React 18
- Vite (bundler)
- React Icons (icônes)
- CSS personnalisé

## 📱 Responsive

L'application est conçue pour fonctionner sur :
- 💻 Navigateur web (testé)
- 📱 Tablette
- 📲 Mobile (à optimiser)

## 👥 Navigation

- **Accueil** : Page de bienvenue
- **Tableau de Bord** : Résumé personnel
- **Bibliothèque Exercices** : Exercices disponibles
- **Mes Programmes** : Programmes personnalisés
- **Messagerie** : Conversation avec le coach
- **Paramètres** : Configuration du compte

---

**Coach Oswald - 2026**
