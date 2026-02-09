import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { LevelConfig } from '../data/levels';
import { GameState } from '../hooks/useGameState';
import { roomObjects } from '../data/roomObjects';
import { LevelSetup } from '../hooks/useLevelSetup';
import RoomObject from './RoomObject';

interface RoomProps {
  levelConfig: LevelConfig;
  gameState: GameState;
  levelSetup: LevelSetup;
  onQuestionObjectClick: () => void;
  onKeyClick: () => void;
  onSwitchClick: () => void;
  onDoorClick: () => void;
  onKeyRevealed: () => void;
}

export default function Room({
  levelConfig,
  gameState,
  levelSetup,
  onQuestionObjectClick,
  onKeyClick,
  onSwitchClick,
  onDoorClick,
  onKeyRevealed,
}: RoomProps) {
  const { scene } = useThree();
  const doorRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  const [switchHovered, setSwitchHovered] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);
  const [keyHovered, setKeyHovered] = useState(false);

  const roomWidth = 10;
  const roomHeight = 5;
  const roomDepth = 10;

  // Update fog and lighting when level changes
  useEffect(() => {
    scene.fog = new THREE.Fog(levelConfig.fogColor, levelConfig.fogNear, levelConfig.fogFar);

    if (ambientRef.current) {
      gsap.to(ambientRef.current.color, {
        r: new THREE.Color(levelConfig.ambientColor).r,
        g: new THREE.Color(levelConfig.ambientColor).g,
        b: new THREE.Color(levelConfig.ambientColor).b,
        duration: 1.5,
      });
      gsap.to(ambientRef.current, { intensity: levelConfig.ambientIntensity, duration: 1.5 });
    }

    if (pointLightRef.current) {
      gsap.to(pointLightRef.current.color, {
        r: new THREE.Color(levelConfig.pointLightColor).r,
        g: new THREE.Color(levelConfig.pointLightColor).g,
        b: new THREE.Color(levelConfig.pointLightColor).b,
        duration: 1.5,
      });
      gsap.to(pointLightRef.current, { intensity: levelConfig.pointLightIntensity, duration: 1.5 });
    }
  }, [levelConfig, scene]);

  // Door open animation
  useEffect(() => {
    if (gameState.doorUnlocked && doorRef.current) {
      gsap.to(doorRef.current.rotation, { y: -Math.PI / 2, duration: 1.5, ease: 'power2.inOut' });
    } else if (doorRef.current) {
      doorRef.current.rotation.y = 0;
    }
  }, [gameState.doorUnlocked]);

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.wallColor, roughness: 0.8, metalness: 0.1,
  }), [levelConfig.wallColor]);

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.floorColor, roughness: 0.9, metalness: 0.05,
  }), [levelConfig.floorColor]);

  const ceilingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.ceilingColor, roughness: 0.95, metalness: 0,
  }), [levelConfig.ceilingColor]);

  // Interaction states
  const switchActive = gameState.keyCollected && !gameState.switchActivated;
  const doorActive = gameState.doorUnlocked;

  const handleKeyRevealComplete = useCallback(() => {
    onKeyRevealed();
  }, [onKeyRevealed]);

  return (
    <group>
      {/* Lighting */}
      <ambientLight ref={ambientRef} color={levelConfig.ambientColor} intensity={levelConfig.ambientIntensity} />
      <pointLight
        ref={pointLightRef}
        position={[0, 2, 0]}
        color={levelConfig.pointLightColor}
        intensity={levelConfig.pointLightIntensity}
        distance={15}
        castShadow
      />
      <pointLight position={[3, 1, 3]} color={levelConfig.pointLightColor} intensity={0.5} distance={8} />
      <pointLight position={[-3, 1, -3]} color={levelConfig.pointLightColor} intensity={0.3} distance={8} />

      {/* Floor */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat}>
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMat}>
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0, -5]} material={wallMat}>
        <planeGeometry args={[roomWidth, roomHeight]} />
      </mesh>

      {/* Front wall with door hole */}
      <mesh position={[-3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      <mesh position={[3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      <mesh position={[0, 1.75, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[4, 1.5]} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>

      {/* ========== ROOM OBJECTS ========== */}
      {roomObjects.map((obj) => {
        const isQuestionObj = obj.id === levelSetup.questionObjectId;
        const isKeyObj = obj.id === levelSetup.keyObjectId;
        const role = isQuestionObj ? 'question' as const : isKeyObj ? 'keyHider' as const : 'none' as const;

        let isActive = false;
        if (isQuestionObj) isActive = !gameState.allQuestionsCorrect;
        // Key hider only shows hint on hover but is not clickable

        return (
          <RoomObject
            key={`${obj.id}-${gameState.currentLevel}-${gameState.seed}`}
            def={obj}
            role={role}
            isActive={isActive}
            shouldReveal={isKeyObj && gameState.allQuestionsCorrect}
            onClick={isQuestionObj && !gameState.allQuestionsCorrect ? onQuestionObjectClick : undefined}
            onRevealComplete={isKeyObj ? handleKeyRevealComplete : undefined}
          />
        );
      })}

      {/* ========== KEY ========== */}
      {gameState.keyRevealed && !gameState.keyCollected && (
        <mesh
          position={levelSetup.keyWorldPosition}
          onClick={onKeyClick}
          onPointerOver={() => { setKeyHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setKeyHovered(false); document.body.style.cursor = 'default'; }}
          scale={keyHovered ? 1.1 : 1}
        >
          {/* Key shaft */}
          <group>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Key head */}
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.1, 0.03, 8, 16]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Key teeth */}
            <mesh position={[0.06, -0.15, 0]}>
              <boxGeometry args={[0.08, 0.05, 0.03]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0.06, -0.2, 0]}>
              <boxGeometry args={[0.06, 0.05, 0.03]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>

          {/* Key hint */}
          {keyHovered && (
            <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-3 py-1.5 rounded bg-background/80 border border-primary/30 font-mono text-xs text-primary whitespace-nowrap backdrop-blur-sm">
                Pick up the key
              </div>
            </Html>
          )}
        </mesh>
      )}

      {/* ========== SWITCH ========== */}
      <group position={[4.9, 0, 2]}>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          onClick={switchActive ? onSwitchClick : undefined}
          onPointerOver={switchActive ? () => { setSwitchHovered(true); document.body.style.cursor = 'pointer'; } : undefined}
          onPointerOut={switchActive ? () => { setSwitchHovered(false); document.body.style.cursor = 'default'; } : undefined}
        >
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial
            color={switchActive ? '#1a3a2a' : gameState.switchActivated ? '#0a2a0a' : '#1a1a1a'}
            roughness={0.5}
          />
        </mesh>
        <mesh
          position={[0, gameState.switchActivated ? 0.15 : -0.15, 0.06]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <boxGeometry args={[0.15, 0.1, 0.15]} />
          <meshStandardMaterial
            color={gameState.switchActivated ? '#00ff00' : '#666666'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {switchHovered && switchActive && (
          <Html position={[0, 0.8, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="px-3 py-1.5 rounded bg-background/80 border border-primary/30 font-mono text-xs text-primary whitespace-nowrap backdrop-blur-sm">
              Use the key on this switch
            </div>
          </Html>
        )}
      </group>

      {/* ========== DOOR ========== */}
      <group ref={doorRef} position={[0, -0.5, 4.95]}>
        <mesh
          rotation={[0, Math.PI, 0]}
          onClick={doorActive ? onDoorClick : undefined}
          onPointerOver={doorActive ? () => { setDoorHovered(true); document.body.style.cursor = 'pointer'; } : undefined}
          onPointerOut={doorActive ? () => { setDoorHovered(false); document.body.style.cursor = 'default'; } : undefined}
        >
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial
            color={doorActive ? '#2a3a2a' : '#1a1208'}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.7, 0, 0.1]} rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
        {doorHovered && doorActive && (
          <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="px-3 py-1.5 rounded bg-background/80 border border-primary/30 font-mono text-xs text-primary whitespace-nowrap backdrop-blur-sm">
              Escape through the door
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
