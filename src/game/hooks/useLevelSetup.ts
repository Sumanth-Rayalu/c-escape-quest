import { useMemo } from 'react';
import { questions, Question } from '../data/questions';
import { roomObjects, RoomObjectDef } from '../data/roomObjects';

export interface LevelSetup {
  questionObjectId: string;
  keyObjectId: string;
  selectedQuestions: Question[];
  keyWorldPosition: [number, number, number];
  questionObject: RoomObjectDef;
  keyObject: RoomObjectDef;
}

/** Simple seeded PRNG (mulberry32) */
function seededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shuffle array with seeded random */
function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useLevelSetup(level: number, seed: number): LevelSetup {
  return useMemo(() => {
    const rand = seededRandom(seed * 31 + level * 7);

    // Pick which object holds questions
    const questionCandidates = roomObjects.filter((o) => o.canHoldQuestions);
    const shuffledQCandidates = shuffle(questionCandidates, rand);
    const questionObject = shuffledQCandidates[0];

    // Pick which object hides the key (must be different from question object)
    const keyCandidates = roomObjects.filter(
      (o) => o.canHideKey && o.id !== questionObject.id
    );
    const shuffledKCandidates = shuffle(keyCandidates, rand);
    const keyObject = shuffledKCandidates[0];

    // Pick 3 random questions for this level
    const levelQuestions = questions.filter((q) => q.level === level);
    const shuffledQuestions = shuffle(levelQuestions, rand);
    const selectedQuestions = shuffledQuestions.slice(0, 3);

    return {
      questionObjectId: questionObject.id,
      keyObjectId: keyObject.id,
      selectedQuestions,
      keyWorldPosition: keyObject.keyWorldPosition || [0, -2, 0],
      questionObject,
      keyObject,
    };
  }, [level, seed]);
}
