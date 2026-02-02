/**
 * COVERS CONFIG - Samurai Marketing
 * Version dynamique - lit depuis Google Sheet via Web App
 *
 * INSTRUCTIONS:
 * 1. Déploie le Google Apps Script comme Web App
 * 2. Remplace COVERS_API_URL par l'URL de ton déploiement
 * 3. Renomme ce fichier en "covers.js" (remplace l'ancien)
 */

// ============================================
// CONFIGURATION
// ============================================

// URL de la Web App Google Apps Script
// REMPLACE CETTE URL après avoir déployé le script !
const COVERS_API_URL = 'YOUR_WEB_APP_URL_HERE';

// ============================================
// CACHE LOCAL (fallback si API indisponible)
// ============================================
let COVER_IDS = {
  // Cover déjà connu - sert de fallback
  "post AI Surfer épinglé": "1vHCzw_8TNzfhYByceBxX09aY42WEJefx"
};

// Flag pour savoir si les covers sont chargés
let coversLoaded = false;

// ============================================
// CHARGEMENT DYNAMIQUE DEPUIS L'API
// ============================================
if (COVERS_API_URL && COVERS_API_URL !== 'YOUR_WEB_APP_URL_HERE') {
  fetch(COVERS_API_URL)
    .then(response => {
      if (!response.ok) throw new Error('API response not ok');
      return response.json();
    })
    .then(data => {
      // L'API retourne {title: coverUrl}
      // On doit extraire les FILE_IDs
      Object.keys(data).forEach(title => {
        const url = data[title];
        // Extraire le FILE_ID de l'URL lh3.googleusercontent.com/d/FILE_ID=w800
        const match = url.match(/\/d\/([^/=]+)/);
        if (match && match[1]) {
          COVER_IDS[title] = match[1];
        }
      });
      coversLoaded = true;
      console.log(`[Covers] ✅ ${Object.keys(COVER_IDS).length} covers chargés depuis l'API`);
    })
    .catch(error => {
      console.warn('[Covers] ⚠️ Erreur chargement API, utilisation du cache local:', error.message);
    });
} else {
  console.warn('[Covers] ⚠️ API URL non configurée, utilisation du cache local uniquement');
}

// ============================================
// FONCTION PUBLIQUE
// ============================================

/**
 * Retourne l'URL du cover pour un titre donné
 * @param {string} title - Le titre exact de la ressource
 * @returns {string|null} - L'URL de l'image ou null si non trouvé
 */
function getCoverUrl(title) {
  const fileId = COVER_IDS[title];
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
  }
  return null;
}

/**
 * Vérifie si les covers sont chargés depuis l'API
 * @returns {boolean}
 */
function areCoversLoaded() {
  return coversLoaded;
}

/**
 * Retourne tous les covers disponibles (pour debug)
 * @returns {object}
 */
function getAllCovers() {
  return { ...COVER_IDS };
}
