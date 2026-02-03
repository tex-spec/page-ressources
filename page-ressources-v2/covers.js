/**
 * COVERS CONFIG - Samurai Marketing
 * Mapping des titres vers les FILE_IDs Google Drive
 * Généré automatiquement le 2 février 2026
 */

const COVER_IDS = {
  // === MATCHES DIRECTS (titre page = titre sheet) ===
  "Opus IA vidéos automatiques": "1axgHlFZu7_XelbMcwGI57MBHD5Uufx3R",
  "Alternative gratuite Bolt Lovable": "1DAEAIlAv91XGZrMt6Jt42vKo-xugkpkU",
  "Meilleurs modèles vidéo IA": "1vSLTw0bhdNnCxHpp_IcJXMn6FUR6QiP2",
  "Animations IA sans montage": "1FRu6kv196e3kEkqDMWU4tS7AN-kSM-Ju",
  "higgsfield's GPT 1.5 image": "16lvVEGt0ajA0sy-25QLeldPuu30rM3rM",
  "pyjama peint": "1ktAxEPGAfxgf8BdjhUk7xEqGAc4osT0y",
  "coherence perso videos": "1a3CYWEGKW2FdMZ7abakca8K_D4ZCK_uv",
  "upscaller": "1xzrB-KgWo3mbqmAicr4mnYgU21cVg1Xp",
  "post AI Surfer épinglé": "1vHCzw_8TNzfhYByceBxX09aY42WEJefx",

  // === MATCHES AVEC VARIATIONS DE TITRE ===
  // Page: "Améliorateur de prompts" | Sheet: "Meilleur optimiseur prompts IA"
  "Améliorateur de prompts": "1wkyaLeQrSeop1YNUo4Ocm6j5vVylKYr-",

  // Page: "google Disco" | Sheet: "Google Disco"
  "google Disco": "1vkSprtYf_frYTPxwch9cDJWj6EBgW_oo",

  // Page: "statistics" | Sheet: "Statistics"
  "statistics": "1qBhm8l22w5zwFci4auUkr22syb_L4Uy7",

  // Page: "nanobanana prompts" | Sheet: "1 000 Prompts Nanobanana"
  "nanobanana prompts": "1d5cK-VqiKhUFRm7K_Or5KtLrxjF_SDOe",

  // Page: "llm council" | Sheet: "LLM"
  "llm council": "1d3gXkxBroebVWhS_XSJT6rGoMY-k1QyD",

  // Page: "Notebook lm skills Canva / Powerpoint" | Sheet: "Notebook lm kills Canva : Powerpoint"
  "Notebook lm skills Canva / Powerpoint": "1dC5aUyw5N-51P23qRqPGuupvWZS2AAKw",

  // === NOUVEAUX COVERS (ajoutés depuis Tex Thumbnail) ===
  "Vole les super pouvoirs de Claude": "1St8cLLUKllB2XR5s2ew6aJ-x-EZTIZTv",
  "Sépare n'importe quel son": "1QD5zfIxQ88pe3OksNceObatjG8B41Qau",
  "Animation IA qualité studio": "1IL7IROt0AgiUhPtWzgICkfPqp15cWB6x",
  "Claude remplace des outils payants": "1YSZH3gDk0eaAT8AEWqBQZcDtoKjOHYnw",
  "Ton ordi bosse pendant que tu dors": "1EHpIVO-6abmNSjmhVgX7cO5JDpDyrzFL",
};

/**
 * Retourne l'URL du cover pour un titre donné
 * @param {string} title - Le titre de la ressource
 * @returns {string|null} - L'URL de l'image ou null si non trouvé
 */
function getCoverUrl(title) {
  const fileId = COVER_IDS[title];
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
  }
  return null;
}
