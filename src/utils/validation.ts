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
