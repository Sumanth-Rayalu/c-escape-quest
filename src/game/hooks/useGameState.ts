import { useReducer, useCallback } from 'react';

export interface GameState {
  gamePhase: 'start' | 'playing' | 'victory';
  currentLevel: number;
  questionAnswered: boolean;
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
  | { type: 'ANSWER_CORRECT' }
  | { type: 'ANSWER_INCORRECT'; message: string }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'REVEAL_KEY' }
  | { type: 'COLLECT_KEY' }
  | { type: 'ACTIVATE_SWITCH' }
  | { type: 'UNLOCK_DOOR' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART' };

const initialState: GameState = {
  gamePhase: 'start',
  currentLevel: 1,
  questionAnswered: false,
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
      return { ...initialState, gamePhase: 'playing' };

    case 'SHOW_QUESTION':
      return { ...state, showQuestion: true };

    case 'HIDE_QUESTION':
      return { ...state, showQuestion: false };

    case 'ANSWER_CORRECT':
      return {
        ...state,
        questionAnswered: true,
        showQuestion: false,
        feedback: { type: 'correct', message: 'Correct! A key has been revealed somewhere in the room...' },
      };

    case 'ANSWER_INCORRECT':
      return {
        ...state,
        feedback: { type: 'incorrect', message: action.message },
      };

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

    case 'UNLOCK_DOOR':
      return { ...state, doorUnlocked: true };

    case 'NEXT_LEVEL':
      if (state.currentLevel >= 5) {
        return { ...state, gamePhase: 'victory' };
      }
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        questionAnswered: false,
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
  const answerCorrect = useCallback(() => dispatch({ type: 'ANSWER_CORRECT' }), []);
  const answerIncorrect = useCallback((message: string) =>
    dispatch({ type: 'ANSWER_INCORRECT', message }), []);
  const clearFeedback = useCallback(() => dispatch({ type: 'CLEAR_FEEDBACK' }), []);
  const revealKey = useCallback(() => dispatch({ type: 'REVEAL_KEY' }), []);
  const collectKey = useCallback(() => dispatch({ type: 'COLLECT_KEY' }), []);
  const activateSwitch = useCallback(() => dispatch({ type: 'ACTIVATE_SWITCH' }), []);
  const unlockDoor = useCallback(() => dispatch({ type: 'UNLOCK_DOOR' }), []);
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  return {
    state,
    startGame,
    showQuestion,
    hideQuestion,
    answerCorrect,
    answerIncorrect,
    clearFeedback,
    revealKey,
    collectKey,
    activateSwitch,
    unlockDoor,
    nextLevel,
    restart,
  };
}
