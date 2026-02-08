import { GameState } from '../hooks/useGameState';
import { LevelConfig } from '../data/levels';

interface HUDProps {
  gameState: GameState;
  levelConfig: LevelConfig;
  onClearFeedback: () => void;
}

export default function HUD({ gameState, levelConfig, onClearFeedback }: HUDProps) {
  const objectives = [
    { label: 'Find the board', done: gameState.questionAnswered },
    { label: 'Solve the challenge', done: gameState.questionAnswered },
    { label: 'Find the key', done: gameState.keyCollected },
    { label: 'Activate switch', done: gameState.switchActivated },
    { label: 'Escape the room', done: gameState.doorUnlocked },
  ];

  // Current objective index
  const currentObj = objectives.findIndex((o) => !o.done);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Level indicator */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((l) => (
                <div
                  key={l}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    l < gameState.currentLevel
                      ? 'bg-primary'
                      : l === gameState.currentLevel
                        ? 'bg-primary animate-pulse'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground">LEVEL {gameState.currentLevel}/5</p>
              <p className="text-sm font-semibold text-foreground">{levelConfig.name}</p>
            </div>
          </div>
        </div>

        {/* Current objective */}
        <div className="text-right">
          <p className="text-xs font-mono text-muted-foreground">OBJECTIVE</p>
          <p className="text-sm font-mono text-primary text-glow">
            {currentObj >= 0 ? `> ${objectives[currentObj].label}` : '> Proceed through the door'}
          </p>
        </div>
      </div>

      {/* Feedback toast */}
      {gameState.feedback && (
        <div className="flex justify-center mt-4 pointer-events-auto">
          <div
            onClick={onClearFeedback}
            className={`cursor-pointer px-6 py-3 rounded-lg font-mono text-sm animate-fade-in backdrop-blur-md ${
              gameState.feedback.type === 'correct'
                ? 'bg-primary/20 border border-primary/40 text-primary box-glow'
                : 'bg-destructive/20 border border-destructive/40 text-destructive'
            }`}
          >
            {gameState.feedback.message}
          </div>
        </div>
      )}

      {/* Bottom hints bar */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <div className="flex justify-center pb-4">
          <p className="text-xs font-mono text-muted-foreground/60 bg-background/30 px-4 py-2 rounded-full backdrop-blur-sm">
            Click on glowing objects to interact • Look around the room for clues
          </p>
        </div>
      </div>
    </div>
  );
}
