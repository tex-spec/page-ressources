/**
 * ========================================
 * SAMURAI MARKETING - Cover Automation Script
 * ========================================
 *
 * Ce script scanne le dossier "Reels Creation" sur Google Drive
 * et met à jour automatiquement le Google Sheet avec les FILE_IDs des covers.
 *
 * INSTALLATION:
 * 1. Ouvre le Google Sheet: https://docs.google.com/spreadsheets/d/1a1liM_3O4E3_3tqoxHwHfEcXf8Td78mI8xWbmj8j1Qg
 * 2. Menu Extensions > Apps Script
 * 3. Supprime le code existant et colle ce fichier
 * 4. Sauvegarde (Ctrl+S)
 * 5. Exécute "setupTrigger" une fois pour activer l'automatisation
 *
 * Le script tournera automatiquement toutes les heures.
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // ID du dossier parent "Reels Creation"
  PARENT_FOLDER_ID: '1Es6TCWI0blffpiK7E_sCb8hLII8tZw2g',

  // Nom de la feuille dans le Google Sheet
  SHEET_NAME: 'Feuille 1',

  // Extensions d'images acceptées pour les covers
  IMAGE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'webp'],

  // Colonnes du Sheet (index 0-based)
  COLUMNS: {
    RESOURCE_ID: 0,      // A
    TITLE: 1,            // B
    VIMEO_ID: 2,         // C
    COVER_GDRIVE_ID: 3,  // D
    COVER_URL: 4,        // E
    FOLDER_NAME: 5,      // F - Nom du dossier Google Drive
    FOLDER_ID: 6,        // G - ID du dossier Google Drive
    LAST_UPDATE: 7       // H - Date de dernière mise à jour
  }
};

// ============================================
// FONCTION PRINCIPALE: Scanner et mettre à jour
// ============================================
function scanAndUpdateCovers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const parentFolder = DriveApp.getFolderById(CONFIG.PARENT_FOLDER_ID);

  // Récupérer les données existantes du Sheet
  const existingData = getExistingData(sheet);

  // Scanner tous les sous-dossiers
  const subfolders = parentFolder.getFolders();
  let updatedCount = 0;
  let newCount = 0;

  while (subfolders.hasNext()) {
    const folder = subfolders.next();
    const folderName = folder.getName();
    const folderId = folder.getId();

    // Chercher une image cover dans ce dossier
    const coverFile = findCoverImage(folder);

    if (coverFile) {
      const coverFileId = coverFile.getId();
      const coverUrl = `https://lh3.googleusercontent.com/d/${coverFileId}=w800`;

      // Vérifier si ce dossier existe déjà dans le Sheet
      const existingRow = existingData.find(row => row.folderId === folderId);

      if (existingRow) {
        // Mettre à jour si le cover a changé
        if (existingRow.coverGdriveId !== coverFileId) {
          updateRow(sheet, existingRow.rowIndex, coverFileId, coverUrl);
          updatedCount++;
        }
      } else {
        // Nouveau dossier - ajouter une ligne
        addNewRow(sheet, folderName, folderId, coverFileId, coverUrl);
        newCount++;
      }
    }
  }

  // Log résumé
  Logger.log(`Scan terminé: ${newCount} nouveaux, ${updatedCount} mis à jour`);

  return {
    newCount: newCount,
    updatedCount: updatedCount
  };
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Trouve le fichier cover (image) dans un dossier
 */
function findCoverImage(folder) {
  const files = folder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName().toLowerCase();

    // Vérifier si c'est une image
    for (const ext of CONFIG.IMAGE_EXTENSIONS) {
      if (fileName.endsWith('.' + ext)) {
        // Priorité aux fichiers qui contiennent "cover" ou le nom du dossier
        return file;
      }
    }
  }

  return null;
}

/**
 * Récupère les données existantes du Sheet
 */
function getExistingData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return []; // Seulement les headers

  const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  return data.map((row, index) => ({
    rowIndex: index + 2, // +2 car index 0-based et header en ligne 1
    resourceId: row[CONFIG.COLUMNS.RESOURCE_ID],
    title: row[CONFIG.COLUMNS.TITLE],
    vimeoId: row[CONFIG.COLUMNS.VIMEO_ID],
    coverGdriveId: row[CONFIG.COLUMNS.COVER_GDRIVE_ID],
    coverUrl: row[CONFIG.COLUMNS.COVER_URL],
    folderName: row[CONFIG.COLUMNS.FOLDER_NAME],
    folderId: row[CONFIG.COLUMNS.FOLDER_ID]
  }));
}

/**
 * Met à jour une ligne existante
 */
function updateRow(sheet, rowIndex, coverFileId, coverUrl) {
  sheet.getRange(rowIndex, CONFIG.COLUMNS.COVER_GDRIVE_ID + 1).setValue(coverFileId);
  sheet.getRange(rowIndex, CONFIG.COLUMNS.COVER_URL + 1).setValue(coverUrl);
  sheet.getRange(rowIndex, CONFIG.COLUMNS.LAST_UPDATE + 1).setValue(new Date());
}

/**
 * Ajoute une nouvelle ligne
 */
function addNewRow(sheet, folderName, folderId, coverFileId, coverUrl) {
  const newRow = [
    '', // resource_id - à remplir manuellement
    cleanFolderName(folderName), // title - extrait du nom du dossier
    '', // vimeo_id - à remplir manuellement
    coverFileId,
    coverUrl,
    folderName,
    folderId,
    new Date()
  ];

  sheet.appendRow(newRow);
}

/**
 * Nettoie le nom du dossier pour en faire un titre
 * Ex: "1. post AI Surfer épinglé" → "post AI Surfer épinglé"
 */
function cleanFolderName(folderName) {
  // Supprimer le préfixe numéroté (ex: "1. ", "23. ")
  return folderName.replace(/^\d+\.\s*/, '').trim();
}

// ============================================
// CONFIGURATION DU TRIGGER AUTOMATIQUE
// ============================================

/**
 * Configure un trigger pour exécuter le scan toutes les heures
 * À exécuter UNE SEULE FOIS
 */
function setupTrigger() {
  // Supprimer les anciens triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'scanAndUpdateCovers') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Créer un nouveau trigger horaire
  ScriptApp.newTrigger('scanAndUpdateCovers')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Trigger configuré: scan toutes les heures');
}

/**
 * Supprime tous les triggers (utile pour le debug)
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  Logger.log('Tous les triggers ont été supprimés');
}

// ============================================
// FONCTIONS DE TEST / DEBUG
// ============================================

/**
 * Test manuel du scan
 */
function testScan() {
  const result = scanAndUpdateCovers();
  Logger.log('Résultat: ' + JSON.stringify(result));
}

/**
 * Liste tous les dossiers dans Reels Creation (debug)
 */
function listAllFolders() {
  const parentFolder = DriveApp.getFolderById(CONFIG.PARENT_FOLDER_ID);
  const subfolders = parentFolder.getFolders();

  const folders = [];
  while (subfolders.hasNext()) {
    const folder = subfolders.next();
    const coverFile = findCoverImage(folder);

    folders.push({
      name: folder.getName(),
      id: folder.getId(),
      hasCover: coverFile !== null,
      coverName: coverFile ? coverFile.getName() : 'N/A'
    });
  }

  Logger.log(JSON.stringify(folders, null, 2));
  return folders;
}

// ============================================
// API WEB POUR LA PAGE RESSOURCES
// ============================================

/**
 * Endpoint web qui retourne les covers en JSON
 * Déployer comme Web App pour l'utiliser
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Convertir en objet {title: coverUrl}
  const covers = {};
  for (let i = 1; i < data.length; i++) {
    const title = data[i][CONFIG.COLUMNS.TITLE];
    const coverUrl = data[i][CONFIG.COLUMNS.COVER_URL];
    if (title && coverUrl) {
      covers[title] = coverUrl;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(covers))
    .setMimeType(ContentService.MimeType.JSON);
}
