import { Suspense, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Room from './components/Room';
import { useGameState } from './hooks/useGameState';
import { questions } from './data/questions';
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
    answerCorrect,
    clearFeedback,
    revealKey,
    collectKey,
    activateSwitch,
    nextLevel,
    restart,
  } = useGameState();

  const currentLevelConfig = useMemo(
    () => levelConfigs[state.currentLevel - 1],
    [state.currentLevel]
  );

  const currentQuestion = useMemo(
    () => questions.find((q) => q.level === state.currentLevel)!,
    [state.currentLevel]
  );

  const handleBoardClick = useCallback(() => {
    if (!state.questionAnswered) {
      showQuestion();
    }
  }, [state.questionAnswered, showQuestion]);

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

  const handleCorrectAnswer = useCallback(() => {
    answerCorrect();
  }, [answerCorrect]);

  const handleKeyRevealed = useCallback(() => {
    revealKey();
  }, [revealKey]);

  // Start screen
  if (state.gamePhase === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  // Victory screen
  if (state.gamePhase === 'victory') {
    return <VictoryScreen onRestart={restart} />;
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* 3D Canvas */}
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
            onBoardClick={handleBoardClick}
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

      {/* HUD Overlay */}
      <HUD
        gameState={state}
        levelConfig={currentLevelConfig}
        onClearFeedback={clearFeedback}
      />

      {/* Question Overlay */}
      {state.showQuestion && (
        <QuestionOverlay
          question={currentQuestion}
          onCorrect={handleCorrectAnswer}
          onClose={hideQuestion}
        />
      )}
    </div>
  );
}
