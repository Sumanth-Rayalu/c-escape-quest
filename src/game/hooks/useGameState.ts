import { useReducer, useCallback } from 'react';

export interface GameState {
  gamePhase: 'start' | 'playing' | 'victory';
  currentLevel: number;
  seed: number;
  lives: number;
  allQuestionsCorrect: boolean;
  keyRevealed: boolean;
  keyCollected: boolean;
  switchActivated: boolean;
  doorUnlocked: boolean;
  showQuestion: boolean;
  feedback: { type: 'correct' | 'incorrect'; message: string } | null;
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SHOW_QUESTION' }
  | { type: 'HIDE_QUESTION' }
  | { type: 'ALL_QUESTIONS_CORRECT' }
  | { type: 'LOSE_LIFE' }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'REVEAL_KEY' }
  | { type: 'COLLECT_KEY' }
  | { type: 'ACTIVATE_SWITCH' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART' };

const initialState: GameState = {
  gamePhase: 'start',
  currentLevel: 1,
  seed: Date.now() % 100000,
  lives: 3,
  allQuestionsCorrect: false,
  keyRevealed: false,
  keyCollected: false,
  switchActivated: false,
  doorUnlocked: false,
  showQuestion: false,
  feedback: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, gamePhase: 'playing', seed: Date.now() % 100000 };

    case 'SHOW_QUESTION':
      return { ...state, showQuestion: true };

    case 'HIDE_QUESTION':
      return { ...state, showQuestion: false };

    case 'ALL_QUESTIONS_CORRECT':
      return {
        ...state,
        allQuestionsCorrect: true,
        showQuestion: false,
        feedback: { type: 'correct', message: 'All puzzles solved! A key has been revealed somewhere...' },
      };

    case 'LOSE_LIFE': {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        return {
          ...initialState,
          gamePhase: 'playing',
          seed: (state.seed + 1) % 100000,
          feedback: { type: 'incorrect', message: 'All lives lost! Restarting from Level 1...' },
        };
      }
      return {
        ...state,
        lives: newLives,
        feedback: {
          type: 'incorrect',
          message: `Wrong answer! ${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining.`,
        },
      };
    }

    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null };

    case 'REVEAL_KEY':
      return { ...state, keyRevealed: true };

    case 'COLLECT_KEY':
      return {
        ...state,
        keyCollected: true,
        feedback: { type: 'correct', message: 'Key collected! Find the switch to unlock the door.' },
      };

    case 'ACTIVATE_SWITCH':
      return {
        ...state,
        switchActivated: true,
        doorUnlocked: true,
        feedback: { type: 'correct', message: 'Switch activated! The door is now unlocked.' },
      };

    case 'NEXT_LEVEL':
      if (state.currentLevel >= 5) {
        return { ...state, gamePhase: 'victory' };
      }
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        lives: 3,
        allQuestionsCorrect: false,
        keyRevealed: false,
        keyCollected: false,
        switchActivated: false,
        doorUnlocked: false,
        showQuestion: false,
        feedback: null,
      };

    case 'RESTART':
      return initialState;

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const showQuestion = useCallback(() => dispatch({ type: 'SHOW_QUESTION' }), []);
  const hideQuestion = useCallback(() => dispatch({ type: 'HIDE_QUESTION' }), []);
  const allQuestionsCorrect = useCallback(() => dispatch({ type: 'ALL_QUESTIONS_CORRECT' }), []);
  const loseLife = useCallback(() => dispatch({ type: 'LOSE_LIFE' }), []);
  const clearFeedback = useCallback(() => dispatch({ type: 'CLEAR_FEEDBACK' }), []);
  const revealKey = useCallback(() => dispatch({ type: 'REVEAL_KEY' }), []);
  const collectKey = useCallback(() => dispatch({ type: 'COLLECT_KEY' }), []);
  const activateSwitch = useCallback(() => dispatch({ type: 'ACTIVATE_SWITCH' }), []);
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  return {
    state,
    startGame,
    showQuestion,
    hideQuestion,
    allQuestionsCorrect,
    loseLife,
    clearFeedback,
    revealKey,
    collectKey,
    activateSwitch,
    nextLevel,
    restart,
  };
}
