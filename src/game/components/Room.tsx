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

  /* ================= REMOVE FOG COMPLETELY ================= */
  useEffect(() => {
    scene.fog = null;
  }, [scene]);

  /* ================= DOOR ANIMATION ================= */
  useEffect(() => {
    if (gameState.doorUnlocked && doorRef.current) {
      gsap.to(doorRef.current.rotation, {
        y: -Math.PI / 2,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    } else if (doorRef.current) {
      doorRef.current.rotation.y = 0;
    }
  }, [gameState.doorUnlocked]);

  /* ================= BRIGHT MATERIALS ================= */
  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: levelConfig.wallColor,
        roughness: 0.5,
        metalness: 0.2,
      }),
    [levelConfig.wallColor]
  );

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: levelConfig.floorColor,
        roughness: 0.6,
        metalness: 0.1,
      }),
    [levelConfig.floorColor]
  );

  const ceilingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: levelConfig.ceilingColor,
        roughness: 0.6,
        metalness: 0.1,
      }),
    [levelConfig.ceilingColor]
  );

  const switchActive = gameState.keyCollected && !gameState.switchActivated;
  const doorActive = gameState.doorUnlocked;

  const handleKeyRevealComplete = useCallback(() => {
    onKeyRevealed();
  }, [onKeyRevealed]);

  return (
    <group>
      {/* ================= STRONG CLEAR LIGHTING ================= */}

      {/* Bright Ambient Light */}
      <ambientLight ref={ambientRef} color="#ffffff" intensity={1.3} />

      {/* Main Center Light */}
      <pointLight
        ref={pointLightRef}
        position={[0, 3, 0]}
        color="#ffffff"
        intensity={2}
        distance={25}
      />

      {/* Corner Fill Lights */}
      <pointLight position={[4, 3, 4]} intensity={1.2} />
      <pointLight position={[-4, 3, -4]} intensity={1.2} />
      <pointLight position={[4, 3, -4]} intensity={1.2} />
      <pointLight position={[-4, 3, 4]} intensity={1.2} />

      {/* ================= ROOM STRUCTURE ================= */}

      {/* Floor */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMat}>
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMat}>
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -5]} material={wallMat}>
        <planeGeometry args={[roomWidth, roomHeight]} />
      </mesh>

      {/* Front Wall (Door Gap) */}
      <mesh position={[-3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      <mesh position={[3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      <mesh position={[0, 1.75, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[4, 1.5]} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>

      {/* ================= ROOM OBJECTS ================= */}
      {roomObjects.map((obj) => {
        const isQuestionObj = obj.id === levelSetup.questionObjectId;
        const isKeyObj = obj.id === levelSetup.keyObjectId;
        const role = isQuestionObj ? 'question' : isKeyObj ? 'keyHider' : 'none';

        let isActive = false;
        if (isQuestionObj) isActive = !gameState.allQuestionsCorrect;

        return (
          <RoomObject
            key={`${obj.id}-${gameState.currentLevel}-${gameState.seed}`}
            def={obj}
            role={role}
            isActive={isActive}
            shouldReveal={isKeyObj && gameState.allQuestionsCorrect}
            onClick={
              isQuestionObj && !gameState.allQuestionsCorrect
                ? onQuestionObjectClick
                : undefined
            }
            onRevealComplete={isKeyObj ? handleKeyRevealComplete : undefined}
          />
        );
      })}

      {/* ================= KEY ================= */}
      {gameState.keyRevealed && !gameState.keyCollected && (
        <mesh
          position={levelSetup.keyWorldPosition}
          onClick={onKeyClick}
          onPointerOver={() => {
            setKeyHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setKeyHovered(false);
            document.body.style.cursor = 'default';
          }}
          scale={keyHovered ? 1.1 : 1}
        >
          <group>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.1, 0.03, 8, 16]} />
              <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>

          {keyHovered && (
            <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-3 py-1.5 rounded bg-background/80 border border-primary/30 font-mono text-xs text-primary whitespace-nowrap backdrop-blur-sm">
                Pick up the key
              </div>
            </Html>
          )}
        </mesh>
      )}

      {/* ================= SWITCH ================= */}
      <group position={[4.9, 0, 2]}>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          onClick={switchActive ? onSwitchClick : undefined}
        >
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#1a3a2a" roughness={0.4} />
        </mesh>
      </group>

      {/* ================= DOOR ================= */}
      <group ref={doorRef} position={[0, -0.5, 4.95]}>
        <mesh
          rotation={[0, Math.PI, 0]}
          onClick={doorActive ? onDoorClick : undefined}
        >
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#2a3a2a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
