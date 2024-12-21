export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[.,!?;:«»""''()\-—]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/œ/g, 'oe'); // Replace œ ligature
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

// Nouvelle fonction pour la comparaison caractère par caractère
export function compareCharacters(typed: string, original: string): boolean[] {
  const normalizedTyped = typed.toLowerCase();
  const normalizedOriginal = original.toLowerCase();
  
  const results: boolean[] = [];
  let typedIndex = 0;
  
  for (let i = 0; i < normalizedOriginal.length; i++) {
    const originalChar = normalizedOriginal[i];
    
    // Si c'est un caractère de ponctuation, on le marque comme correct
    if (/[.,!?;:«»""''()\-—\s]/.test(originalChar)) {
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
           /[.,!?;:«»""''()\-—\s]/.test(normalizedTyped[typedIndex])) {
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
