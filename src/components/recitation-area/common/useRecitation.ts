import { useState, useEffect } from 'react';
import { UseRecitationProps, RecitationState } from './types';
import { validateLine } from '../../../utils/validation';
import { addRecitedVerse } from '../../../utils/localStorage';

const VERSES_PER_SECTION = 4;

export function useRecitation({ poem, onValidation, onTextChange }: UseRecitationProps) {
  const [state, setState] = useState<RecitationState>({
    recitation: '',
    validatedLines: [],
    correctCount: 0,
    currentLineIndex: 0,
    currentSection: 0
  });

  useEffect(() => {
    setState({
      recitation: '',
      validatedLines: [],
      correctCount: 0,
      currentLineIndex: 0,
      currentSection: 0
    });
  }, [poem]);

  useEffect(() => {
    const handleSectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section !== undefined) {
        const newSection = customEvent.detail.section;
        const newStartIndex = newSection * VERSES_PER_SECTION;
        setState(prev => ({
          ...prev,
          recitation: '',
          currentLineIndex: newStartIndex,
          currentSection: newSection
        }));
      }
    };

    window.addEventListener('sectionChange', handleSectionChange);
    return () => window.removeEventListener('sectionChange', handleSectionChange);
  }, []);

  const validateVerse = (text: string) => {
    if (!poem) return false;

    const isCorrect = validateLine(text, poem.content[state.currentLineIndex]);
    
    if (isCorrect) {
      addRecitedVerse(poem.id.toString(), poem.title, poem.content[state.currentLineIndex]);

      const newValidatedLines = [...state.validatedLines];
      newValidatedLines[state.currentLineIndex] = true;
      
      const newCorrectCount = newValidatedLines.filter(Boolean).length;
      const nextLineIndex = state.currentLineIndex + 1;
      const newSection = Math.floor(nextLineIndex / VERSES_PER_SECTION);

      setState(prev => ({
        ...prev,
        validatedLines: newValidatedLines,
        correctCount: newCorrectCount,
        currentLineIndex: nextLineIndex,
        currentSection: newSection,
        recitation: ''
      }));

      onValidation(newValidatedLines);
      return true;
    }

    return false;
  };

  const updateRecitation = (text: string) => {
    setState(prev => ({ ...prev, recitation: text }));
    onTextChange(text, state.currentLineIndex);
  };

  const getCurrentSectionLines = () => {
    const start = state.currentSection * VERSES_PER_SECTION;
    const end = Math.min(start + VERSES_PER_SECTION, poem?.content.length || 0);
    return Array.from(
      { length: end - start }, 
      (_, i) => state.validatedLines[start + i] || false
    );
  };

  const getOpacity = (index: number) => {
    const baseOpacity = 0.3;
    const opacityStep = (1 - baseOpacity) / (VERSES_PER_SECTION - 1);
    return baseOpacity + (opacityStep * (VERSES_PER_SECTION - 1 - index));
  };

  const restart = () => {
    setState({
      recitation: '',
      validatedLines: [],
      correctCount: 0,
      currentLineIndex: 0,
      currentSection: 0
    });
    onValidation([]);
  };

  return {
    state,
    validateVerse,
    updateRecitation,
    getCurrentSectionLines,
    getOpacity,
    VERSES_PER_SECTION,
    restart
  };
}
