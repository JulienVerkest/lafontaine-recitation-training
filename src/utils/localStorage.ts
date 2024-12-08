const VERSES_COUNT_KEY = 'recitedVerses';
const RECITED_VERSES_KEY = 'recitedVersesDetails';

interface RecitedVerse {
  poemTitle: string;
  lines: string[];
}

interface RecitedVerses {
  [poemId: string]: RecitedVerse;
}

export const getVersesCount = (): number => {
  const count = localStorage.getItem(VERSES_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementVersesCount = (amount: number = 1): number => {
  const currentCount = getVersesCount();
  const newCount = currentCount + amount;
  localStorage.setItem(VERSES_COUNT_KEY, newCount.toString());
  return newCount;
};

export const getRecitedVerses = (): RecitedVerses => {
  const verses = localStorage.getItem(RECITED_VERSES_KEY);
  return verses ? JSON.parse(verses) : {};
};

export const addRecitedVerse = (
  poemId: string,
  poemTitle: string,
  line: string
): void => {
  const verses = getRecitedVerses();
  if (!verses[poemId]) {
    verses[poemId] = {
      poemTitle,
      lines: []
    };
  }
  if (!verses[poemId].lines.includes(line)) {
    verses[poemId].lines.push(line);
    localStorage.setItem(RECITED_VERSES_KEY, JSON.stringify(verses));
  }
};
