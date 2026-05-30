# Guide de déploiement — Classia
### Vercel + Airtable + Brevo · Étape par étape

---

## Vue d'ensemble

| Outil | Rôle | Coût |
|---|---|---|
| **Vercel** | Héberge la page → génère un lien public | Gratuit |
| **Airtable** | Collecte les inscriptions dans un tableau | Gratuit |
| **Brevo** | Envoie l'email avec ton lien, track les clics | Gratuit jusqu'à 300 mails/jour |

Durée totale estimée : **~45 minutes** la première fois.

---

## ÉTAPE 1 — Airtable (collecter les inscrits)

### 1.1 Créer un compte
Aller sur **airtable.com** → créer un compte gratuit.

### 1.2 Créer une base et une table
1. Cliquer **"+ Create a base"** → choisir "Start from scratch"
2. Nommer la base : `Classia`
3. Renommer la table par défaut : `Testeurs`
4. Créer ces colonnes exactement (respecte la casse) :

| Nom de la colonne | Type |
|---|---|
| `Prénom` | Single line text |
| `Email` | Email |
| `Date` | Date (activer "Include time") |

### 1.3 Récupérer ton Base ID
1. Aller sur **airtable.com/api**
2. Cliquer sur ta base `Classia`
3. Dans l'URL de la page, copier la partie qui ressemble à `appXXXXXXXXXXXXXX`
   → C'est ton **Base ID**

### 1.4 Créer un token d'accès
1. Aller sur **airtable.com/create/tokens**
2. Cliquer **"+ Create token"**
3. Nommer le token : `classia-site`
4. Dans **Scopes**, cocher : `data.records:write`
5. Dans **Access**, sélectionner ta base `Classia`
6. Cliquer **"Create token"**
7. **Copier le token maintenant** (il ne sera plus affiché après)

### 1.5 Mettre à jour le fichier React
Ouvrir `classia.jsx` et remplacer en haut du fichier :

```js
const AIRTABLE_TOKEN = "COLLE_TON_TOKEN_ICI";
const AIRTABLE_BASE_ID = "COLLE_TON_BASE_ID_ICI";
```

Par tes vraies valeurs :

```js
const AIRTABLE_TOKEN = "patXXXXXXXXXXXXXX.XXXXXXXX"; // ton token
const AIRTABLE_BASE_ID = "appXXXXXXXXXXXXXX";          // ton base ID
```

---

## ÉTAPE 2 — Vercel (mettre en ligne)

### 2.1 Préparer le projet en local
Sur ton ordinateur, ouvre un terminal et exécute :

```bash
# Créer un projet React avec Vite
npm create vite@latest classia -- --template react
cd classia
npm install
```

### 2.2 Remplacer le fichier principal
1. Dans le dossier `classia/src/`, supprimer `App.jsx` et `App.css`
2. Copier ton fichier `classia.jsx` dans `src/`
3. Ouvrir `src/main.jsx` et remplacer son contenu par :

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Classia from './classia.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Classia />
  </React.StrictMode>
)
```

4. Ouvrir `index.html` à la racine et remplacer le `<title>` :

```html
<title>Classia — Projet en développement</title>
```

### 2.3 Tester en local
```bash
npm run dev
```
Ouvrir **http://localhost:5173** → vérifier que tout s'affiche bien.

### 2.4 Publier sur GitHub
1. Aller sur **github.com** → créer un nouveau repo nommé `classia`
2. Dans ton terminal :

```bash
git init
git add .
git commit -m "init classia"
git remote add origin https://github.com/TON_USERNAME/classia.git
git push -u origin main
```

### 2.5 Déployer sur Vercel
1. Aller sur **vercel.com** → créer un compte (connecte-toi avec GitHub)
2. Cliquer **"Add New Project"**
3. Sélectionner ton repo `classia`
4. Vercel détecte automatiquement Vite → cliquer **"Deploy"**
5. En 2 minutes, tu obtiens un lien du type : `https://classia.vercel.app`

### 2.6 (Optionnel) Nom de domaine personnalisé
- Acheter `classia.fr` sur **ovhcloud.com** (~10€/an)
- Dans Vercel → Settings → Domains → ajouter ton domaine
- Suivre les instructions DNS d'OVH (environ 15 min de propagation)

---

## ÉTAPE 3 — Brevo (envoyer l'email + tracker les clics)

### 3.1 Créer un compte
Aller sur **brevo.com** → créer un compte gratuit.
Le plan gratuit inclut 300 emails/jour, ce qui est largement suffisant.

### 3.2 Créer la campagne email
1. Dans le menu : **Campaigns → Email → Create an email campaign**
2. Nommer la campagne : `Classia - Beta testeurs`
3. Objet du mail : `Vous avez demandé à suivre Classia — voici où on en est`
4. Choisir ton adresse d'expéditeur

### 3.3 Rédiger l'email
Utiliser l'éditeur Brevo. Voici un modèle simple :

---
**Objet :** Vous avez demandé à suivre Classia — voici où on en est

Bonjour,

Il y a quelques semaines, vous avez accepté d'être tenu informé du développement de Classia.

Nous avons quelque chose à vous montrer.

**→ [Voir l'avancement du projet](https://classia.vercel.app)**

À très bientôt,
L'équipe Classia

---

> ⚠️ **Important** : le lien `https://classia.vercel.app` doit être un vrai lien cliquable dans l'email. Brevo le trackera automatiquement.

### 3.4 Importer ta liste de contacts
1. Dans Brevo → **Contacts → Import contacts**
2. Importer ton fichier CSV avec les emails des enseignants
3. Créer une liste nommée `Classia - questionnaire`

### 3.5 Activer le tracking
Dans les paramètres de la campagne, vérifier que ces options sont activées :
- ✅ **Track email opens**
- ✅ **Track link clicks**

### 3.6 Envoyer ou programmer
- **Envoyer maintenant** : bouton "Send now"
- **Programmer** : choisir une date/heure (recommandé : mardi ou mercredi, 9h-11h)

### 3.7 Voir les statistiques
Après envoi → **Campaigns → ta campagne** :
- **Taux d'ouverture** : qui a ouvert l'email
- **Taux de clic** : qui a cliqué le lien vers ta page
- **Liste des cliqueurs** : tu peux exporter les emails des gens qui ont cliqué

---

## Résumé du flux complet

```
Email Brevo
    ↓  (lien tracké)
Page Classia sur Vercel
    ↓  (formulaire soumis)
Airtable — table "Testeurs"
    → Prénom | Email | Date d'inscription
```

---

## Vérifications finales avant envoi

- [ ] La page s'affiche sur ton lien Vercel
- [ ] Le formulaire envoie bien une ligne dans Airtable (tester avec ton propre email)
- [ ] Le lien dans l'email pointe vers le bon URL
- [ ] Tu as prévisualisé l'email sur mobile dans Brevo

---

*Guide préparé pour le projet Classia — Mai 2025*
