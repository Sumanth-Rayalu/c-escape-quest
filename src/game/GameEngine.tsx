import { Suspense, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Room from './components/Room';
import { useGameState } from './hooks/useGameState';
import { useLevelSetup } from './hooks/useLevelSetup';
import { levelConfigs } from './data/levels';
import QuestionOverlay from './ui/QuestionOverlay';
import HUD from './ui/HUD';
import StartScreen from './ui/StartScreen';
import VictoryScreen from './ui/VictoryScreen';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

export default function GameEngine() {
  const {
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
  } = useGameState();

  const levelSetup = useLevelSetup(state.currentLevel, state.seed);

  const currentLevelConfig = useMemo(
    () => levelConfigs[state.currentLevel - 1],
    [state.currentLevel]
  );

  const handleQuestionObjectClick = useCallback(() => {
    if (!state.allQuestionsCorrect) {
      showQuestion();
    }
  }, [state.allQuestionsCorrect, showQuestion]);

  const handleKeyClick = useCallback(() => {
    if (state.keyRevealed && !state.keyCollected) {
      collectKey();
    }
  }, [state.keyRevealed, state.keyCollected, collectKey]);

  const handleSwitchClick = useCallback(() => {
    if (state.keyCollected && !state.switchActivated) {
      activateSwitch();
    }
  }, [state.keyCollected, state.switchActivated, activateSwitch]);

  const handleDoorClick = useCallback(() => {
    if (state.doorUnlocked) {
      clearFeedback();
      setTimeout(() => nextLevel(), 500);
    }
  }, [state.doorUnlocked, clearFeedback, nextLevel]);

  const handleKeyRevealed = useCallback(() => {
    revealKey();
  }, [revealKey]);

  if (state.gamePhase === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  if (state.gamePhase === 'victory') {
    return <VictoryScreen onRestart={restart} />;
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <Canvas
        camera={{ position: [0, 1, 6], fov: 60, near: 0.1, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: currentLevelConfig.fogColor }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Room
            levelConfig={currentLevelConfig}
            gameState={state}
            levelSetup={levelSetup}
            onQuestionObjectClick={handleQuestionObjectClick}
            onKeyClick={handleKeyClick}
            onSwitchClick={handleSwitchClick}
            onDoorClick={handleDoorClick}
            onKeyRevealed={handleKeyRevealed}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          target={[0, 0, 0]}
          enabled={!state.showQuestion}
        />
      </Canvas>

      <HUD
        gameState={state}
        levelConfig={currentLevelConfig}
        onClearFeedback={clearFeedback}
      />

      {state.showQuestion && (
        <QuestionOverlay
          questions={levelSetup.selectedQuestions}
          lives={state.lives}
          onAllCorrect={allQuestionsCorrect}
          onWrong={loseLife}
          onClose={hideQuestion}
        />
      )}
    </div>
  );
}
