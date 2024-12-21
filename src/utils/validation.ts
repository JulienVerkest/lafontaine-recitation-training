// Fonction utilitaire pour la gestion des ponctuations avec espace avant
const PUNCTUATION_WITH_SPACE = [' :', ' ;', ' !', ' ?'];
const SIMPLE_PUNCTUATION = /[.,«»""''()\-—]/;

function isPunctuationWithSpace(str: string, index: number): boolean {
  if (index === 0) return false;
  
  for (const punct of PUNCTUATION_WITH_SPACE) {
    if (str.slice(index - 1, index + punct.length - 1) === punct) {
      return true;
    }
  }
  return false;
}

function isSimplePunctuation(char: string): boolean {
  return SIMPLE_PUNCTUATION.test(char);
}

export function normalizeText(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents

  let result = '';
  for (let i = 0; i < normalized.length; i++) {
    // Ignorer les caractères de ponctuation avec espace avant
    if (isPunctuationWithSpace(normalized, i)) {
      continue;
    }
    // Ignorer la ponctuation simple
    if (isSimplePunctuation(normalized[i])) {
      continue;
    }
    result += normalized[i];
  }

  return result
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/œ/g, 'oe') // Replace œ ligature
    .trim();
}

export function validateLine(recited: string, original: string): boolean {
  const normalizedRecited = normalizeText(recited);
  const normalizedOriginal = normalizeText(original);
  return normalizedRecited === normalizedOriginal;
}

export function validateRecitation(recited: string[], original: string[]): boolean[] {
  return recited.map((line, index) => {
    if (index >= original.length) return false;
    return validateLine(line, original[index]);
  });
}

export function compareCharacters(typed: string, original: string): boolean[] {
  const normalizedTyped = typed.toLowerCase();
  const normalizedOriginal = original.toLowerCase();
  
  const results: boolean[] = [];
  let typedIndex = 0;
  
  for (let i = 0; i < normalizedOriginal.length; i++) {
    const originalChar = normalizedOriginal[i];
    
    // Gestion des ponctuations avec espace avant
    if (isPunctuationWithSpace(normalizedOriginal, i)) {
      results.push(true);
      continue;
    }
    
    // Gestion des ponctuations simples
    if (isSimplePunctuation(originalChar)) {
      results.push(true);
      continue;
    }
    
    // Gestion des espaces
    if (/\s/.test(originalChar)) {
      results.push(true);
      continue;
    }
    
    // Si on a dépassé la longueur du texte tapé
    if (typedIndex >= normalizedTyped.length) {
      results.push(false);
      continue;
    }
    
    // On cherche le prochain caractère non-ponctuation dans le texte tapé
    while (typedIndex < normalizedTyped.length && 
           (isSimplePunctuation(normalizedTyped[typedIndex]) || 
            /\s/.test(normalizedTyped[typedIndex]) ||
            isPunctuationWithSpace(normalizedTyped, typedIndex))) {
      typedIndex++;
    }
    
    // Comparaison des caractères
    results.push(
      typedIndex < normalizedTyped.length && 
      normalizedTyped[typedIndex] === originalChar
    );
    
    typedIndex++;
  }
  
  return results;
}
