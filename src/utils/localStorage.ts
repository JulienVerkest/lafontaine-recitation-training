const VERSES_COUNT_KEY = 'recitedVerses';
const RECITED_VERSES_KEY = 'recitedVersesDetails';
const LAST_SELECTED_POEM_KEY = 'lastSelectedPoem';
const HAS_VISITED_KEY = 'hasVisited';

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

export const saveLastSelectedPoem = (poemId: number): void => {
  localStorage.setItem(LAST_SELECTED_POEM_KEY, poemId.toString());
  localStorage.setItem(HAS_VISITED_KEY, 'true');
};

export const getLastSelectedPoem = (): number | null => {
  const poemId = localStorage.getItem(LAST_SELECTED_POEM_KEY);
  return poemId ? parseInt(poemId, 10) : null;
};

export const hasVisitedBefore = (): boolean => {
  return localStorage.getItem(HAS_VISITED_KEY) === 'true';
};
