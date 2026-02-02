# Guide d'Installation - Système Automatisé de Covers

## Temps estimé : 10 minutes

---

## ÉTAPE 1 : Configurer le Google Sheet (2 min)

1. Ouvre le Google Sheet : https://docs.google.com/spreadsheets/d/1a1liM_3O4E3_3tqoxHwHfEcXf8Td78mI8xWbmj8j1Qg

2. Vérifie que les headers en ligne 1 sont :
   ```
   resource_id | title | vimeo_id | cover_gdrive_id | cover_url | folder_name | folder_id | last_update
   ```

3. Renomme la feuille en "Feuille 1" si ce n'est pas déjà fait (clic droit sur l'onglet en bas)

---

## ÉTAPE 2 : Installer le Google Apps Script (5 min)

1. Dans le Google Sheet, va dans **Extensions > Apps Script**

2. **Supprime** tout le code existant dans l'éditeur

3. **Copie-colle** le contenu du fichier `GOOGLE_APPS_SCRIPT.js` (dans ce dossier)

4. **Sauvegarde** (Ctrl+S ou Cmd+S)

5. Exécute la fonction `setupTrigger` :
   - Dans le menu déroulant en haut, sélectionne `setupTrigger`
   - Clique sur "Exécuter" (▶️)
   - Autorise les permissions Google (tu verras un popup)

6. Exécute `scanAndUpdateCovers` une première fois :
   - Sélectionne `scanAndUpdateCovers` dans le menu
   - Clique sur "Exécuter"
   - Regarde le Sheet → il devrait se remplir avec tous les dossiers !

---

## ÉTAPE 3 : Publier le Sheet comme Web App (3 min)

Pour que la page puisse lire le Sheet, il faut le publier :

1. Dans Apps Script, va dans **Déployer > Nouveau déploiement**

2. Clique sur l'engrenage ⚙️ et sélectionne **Application Web**

3. Configure :
   - Description : "Cover API"
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**

4. Clique sur **Déployer**

5. **Copie l'URL** du déploiement (elle ressemble à : `https://script.google.com/macros/s/AKfyc.../exec`)

6. **Colle cette URL** dans le fichier `covers.js` à la ligne indiquée (voir section suivante)

---

## ÉTAPE 4 : Mettre à jour covers.js

Ouvre `covers.js` et remplace son contenu par :

```javascript
/**
 * COVERS CONFIG - Samurai Marketing
 * Version dynamique - lit depuis Google Sheet
 */

// URL de la Web App Google Apps Script (remplace par la tienne)
const COVERS_API_URL = 'https://script.google.com/macros/s/XXXXXX/exec';

// Cache local (fallback si l'API ne répond pas)
let COVER_IDS = {
  "post AI Surfer épinglé": "1vHCzw_8TNzfhYByceBxX09aY42WEJefx"
};

// Charger les covers depuis l'API au démarrage
fetch(COVERS_API_URL)
  .then(res => res.json())
  .then(data => {
    // Convertir {title: url} en {title: fileId}
    Object.keys(data).forEach(title => {
      const url = data[title];
      const match = url.match(/\/d\/([^/=]+)/);
      if (match) {
        COVER_IDS[title] = match[1];
      }
    });
    console.log('Covers chargés:', Object.keys(COVER_IDS).length);
  })
  .catch(err => console.warn('Erreur chargement covers, utilisation du cache:', err));

// Fonction pour obtenir l'URL du cover
function getCoverUrl(title) {
  const fileId = COVER_IDS[title];
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
  }
  return null;
}
```

---

## ÉTAPE 5 : Mapper les titres (one-time)

Le script va créer des lignes pour TOUS les dossiers Google Drive. Mais les titres dans la colonne B seront les noms des dossiers, pas forcément les titres exacts de la page.

Tu dois faire correspondre UNE FOIS :

1. Ouvre le Google Sheet
2. Pour chaque ligne, vérifie que le `title` (colonne B) correspond au titre dans index.html
3. Si différent, corrige-le manuellement

Exemple :
- Dossier : "2. 1 000 Prompts Nanobanana"
- Titre page : "nanobanana prompts"
- → Remplace par "nanobanana prompts" dans le Sheet

---

## ÉTAPE 6 : Déployer sur Netlify

1. Pousse les modifications sur le repo OU
2. Upload les fichiers modifiés (index.html, covers.js) sur Netlify

---

## Comment ça marche maintenant ?

1. **Tex crée un Reel** dans Remixer
2. **Export vers Google Drive** → Dossier créé avec cover
3. **Google Apps Script** scanne toutes les heures → Ajoute la ligne dans le Sheet
4. **Tex va dans le Sheet** → Remplit resource_id, title (si différent), vimeo_id
5. **La page** charge les covers depuis le Sheet → Cover affichée !

---

## Debug

**Les covers ne s'affichent pas ?**
1. Vérifie que l'URL de la Web App est correcte dans covers.js
2. Ouvre la console navigateur (F12) → Cherche les erreurs
3. Teste l'URL de la Web App directement dans le navigateur → Tu dois voir du JSON

**Le script ne tourne pas ?**
1. Dans Apps Script, va dans "Déclencheurs" (icône horloge à gauche)
2. Vérifie qu'il y a un trigger "scanAndUpdateCovers" configuré

**Nouveau dossier pas détecté ?**
Le script tourne toutes les heures. Tu peux forcer un scan en exécutant `scanAndUpdateCovers` manuellement.

---

## Résumé des fichiers

| Fichier | Rôle |
|---------|------|
| GOOGLE_APPS_SCRIPT.js | Script à copier dans Apps Script |
| covers.js | Config qui charge depuis le Sheet |
| index.html | Page React (pas de modif nécessaire) |
| MAPPING_INITIAL.csv | Référence des 20 ressources initiales |
| GUIDE_INSTALLATION.md | Ce guide |
