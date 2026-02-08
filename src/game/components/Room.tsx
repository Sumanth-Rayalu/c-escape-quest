import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { LevelConfig } from '../data/levels';
import { GameState } from '../hooks/useGameState';

interface RoomProps {
  levelConfig: LevelConfig;
  gameState: GameState;
  onBoardClick: () => void;
  onKeyClick: () => void;
  onSwitchClick: () => void;
  onDoorClick: () => void;
  onKeyRevealed: () => void;
}

export default function Room({
  levelConfig,
  gameState,
  onBoardClick,
  onKeyClick,
  onSwitchClick,
  onDoorClick,
  onKeyRevealed,
}: RoomProps) {
  const { scene } = useThree();

  // Refs for interactive objects
  const boardRef = useRef<THREE.Mesh>(null);
  const keyRef = useRef<THREE.Mesh>(null);
  const keyGlowRef = useRef<THREE.PointLight>(null);
  const switchRef = useRef<THREE.Mesh>(null);
  const doorRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  // Key reveal animation refs
  const drawerRef = useRef<THREE.Mesh>(null);
  const paintingRef = useRef<THREE.Mesh>(null);
  const floorTileRef = useRef<THREE.Mesh>(null);
  const wallPanelRef = useRef<THREE.Mesh>(null);

  // Hover states
  const boardHoverRef = useRef(false);
  const keyHoverRef = useRef(false);
  const switchHoverRef = useRef(false);
  const doorHoverRef = useRef(false);

  // Room dimensions
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

    // Reset reveal objects
    if (drawerRef.current) drawerRef.current.position.z = -4.3;
    if (paintingRef.current) paintingRef.current.position.x = -4.95;
    if (floorTileRef.current) floorTileRef.current.position.y = -2.48;
    if (wallPanelRef.current) wallPanelRef.current.rotation.y = 0;
  }, [levelConfig, scene]);

  // Key reveal animation
  useEffect(() => {
    if (!gameState.questionAnswered) return;

    const timer = setTimeout(() => {
      switch (levelConfig.keyRevealType) {
        case 'table':
          // Key just appears on table with scale animation
          if (keyRef.current) {
            keyRef.current.scale.set(0, 0, 0);
            gsap.to(keyRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'back.out(2)' });
          }
          break;
        case 'drawer':
          if (drawerRef.current) {
            gsap.to(drawerRef.current.position, { z: -3.2, duration: 1.2, ease: 'power2.out' });
          }
          break;
        case 'painting':
          if (paintingRef.current) {
            gsap.to(paintingRef.current.position, { x: -3.5, duration: 1.5, ease: 'power2.out' });
          }
          break;
        case 'floor':
          if (floorTileRef.current) {
            gsap.to(floorTileRef.current.position, { y: -1.5, duration: 1.0, ease: 'power2.out' });
          }
          break;
        case 'wall':
          if (wallPanelRef.current) {
            gsap.to(wallPanelRef.current.rotation, { y: Math.PI / 2, duration: 1.5, ease: 'power2.out' });
          }
          break;
      }

      if (keyGlowRef.current) {
        gsap.fromTo(keyGlowRef.current, { intensity: 0 }, { intensity: 3, duration: 1, ease: 'power2.out' });
      }

      onKeyRevealed();
    }, 800);

    return () => clearTimeout(timer);
  }, [gameState.questionAnswered, levelConfig.keyRevealType, onKeyRevealed]);

  // Door open animation
  useEffect(() => {
    if (gameState.doorUnlocked && doorRef.current) {
      gsap.to(doorRef.current.rotation, { y: -Math.PI / 2, duration: 1.5, ease: 'power2.inOut' });
    } else if (doorRef.current) {
      doorRef.current.rotation.y = 0;
    }
  }, [gameState.doorUnlocked]);

  // Key bob animation
  useFrame((_, delta) => {
    if (keyRef.current && gameState.keyRevealed && !gameState.keyCollected) {
      keyRef.current.rotation.y += delta * 2;
      keyRef.current.position.y = keyRef.current.userData.baseY + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  // Materials
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.wallColor,
    roughness: 0.8,
    metalness: 0.1,
  }), [levelConfig.wallColor]);

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.floorColor,
    roughness: 0.9,
    metalness: 0.05,
  }), [levelConfig.floorColor]);

  const ceilingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: levelConfig.ceilingColor,
    roughness: 0.95,
    metalness: 0,
  }), [levelConfig.ceilingColor]);

  // Key positions per reveal type
  const keyPosition = useMemo((): [number, number, number] => {
    switch (levelConfig.keyRevealType) {
      case 'table': return [2, -1.2, 0];
      case 'drawer': return [3.5, -1.5, -3.6];
      case 'painting': return [-4.5, 0.5, 2];
      case 'floor': return [0, -2.2, 0];
      case 'wall': return [4.5, 0.5, -2];
      default: return [0, 0, 0];
    }
  }, [levelConfig.keyRevealType]);

  const handlePointerOver = (ref: React.MutableRefObject<boolean>, meshRef: React.MutableRefObject<THREE.Mesh | null>) => {
    ref.current = true;
    document.body.style.cursor = 'pointer';
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.2 });
    }
  };

  const handlePointerOut = (ref: React.MutableRefObject<boolean>, meshRef: React.MutableRefObject<THREE.Mesh | null>) => {
    ref.current = false;
    document.body.style.cursor = 'default';
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
    }
  };

  const boardActive = !gameState.questionAnswered;
  const keyActive = gameState.keyRevealed && !gameState.keyCollected;
  const switchActive = gameState.keyCollected && !gameState.switchActivated;
  const doorActive = gameState.doorUnlocked;

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

      {/* Front wall (with door hole) */}
      {/* Left part */}
      <mesh position={[-3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      {/* Right part */}
      <mesh position={[3.5, 0, 5]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[3, roomHeight]} />
      </mesh>
      {/* Top part above door */}
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

      {/* ========== FURNITURE ========== */}

      {/* Table */}
      <group position={[2, -1.8, 0]}>
        {/* Table top */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.1, 1.2]} />
          <meshStandardMaterial color="#2a1f14" roughness={0.7} />
        </mesh>
        {/* Legs */}
        {[[-0.8, 0, -0.5], [0.8, 0, -0.5], [-0.8, 0, 0.5], [0.8, 0, 0.5]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="#1a1208" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Desk/Drawer on back wall */}
      <group position={[3.5, -1.8, -4.3]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <meshStandardMaterial color="#2a1f14" roughness={0.7} />
        </mesh>
        {/* Drawer (slides out) */}
        <mesh ref={drawerRef} position={[0, 0.3, -4.3]}>
          <boxGeometry args={[1.2, 0.3, 0.7]} />
          <meshStandardMaterial color="#3a2f24" roughness={0.6} />
        </mesh>
      </group>

      {/* Painting on left wall */}
      <mesh
        ref={paintingRef}
        position={[-4.95, 0.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshStandardMaterial color="#4a3520" roughness={0.5} />
      </mesh>

      {/* Floor tile (liftable) */}
      <mesh
        ref={floorTileRef}
        position={[0, -2.48, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.2, 1.2]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Wall panel (rotatable) */}
      <group position={[4.95, 0.5, -2]}>
        <mesh
          ref={wallPanelRef}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[0.05, 1.2, 1.2]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ========== QUESTION BOARD ========== */}
      <group position={[0, 0.5, -4.9]}>
        <mesh
          ref={boardRef}
          onClick={boardActive ? onBoardClick : undefined}
          onPointerOver={boardActive ? () => handlePointerOver(boardHoverRef, boardRef) : undefined}
          onPointerOut={boardActive ? () => handlePointerOut(boardHoverRef, boardRef) : undefined}
        >
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial
            color={boardActive ? '#1a3a2a' : '#1a1a1a'}
            roughness={0.5}
            emissive={boardActive ? levelConfig.pointLightColor : '#000000'}
            emissiveIntensity={boardActive ? 0.15 : 0}
          />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.2}
          color={boardActive ? levelConfig.pointLightColor : '#333333'}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {boardActive ? '[ CLICK TO ACCESS TERMINAL ]' : '[ SOLVED ]'}
        </Text>
        {boardActive && (
          <pointLight position={[0, 0, 0.5]} color={levelConfig.pointLightColor} intensity={0.8} distance={3} />
        )}
      </group>

      {/* ========== KEY ========== */}
      {gameState.keyRevealed && !gameState.keyCollected && (
        <group>
          <mesh
            ref={keyRef}
            position={keyPosition}
            onClick={keyActive ? onKeyClick : undefined}
            onPointerOver={keyActive ? () => handlePointerOver(keyHoverRef, keyRef) : undefined}
            onPointerOut={keyActive ? () => handlePointerOut(keyHoverRef, keyRef) : undefined}
            userData={{ baseY: keyPosition[1] }}
          >
            {/* Key shape - shaft */}
            <group>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial
                  color="#ffd700"
                  roughness={0.2}
                  metalness={0.9}
                  emissive="#ffa500"
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Key head */}
              <mesh position={[0, 0.25, 0]}>
                <torusGeometry args={[0.1, 0.03, 8, 16]} />
                <meshStandardMaterial
                  color="#ffd700"
                  roughness={0.2}
                  metalness={0.9}
                  emissive="#ffa500"
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Key teeth */}
              <mesh position={[0.06, -0.15, 0]}>
                <boxGeometry args={[0.08, 0.05, 0.03]} />
                <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
              </mesh>
              <mesh position={[0.06, -0.2, 0]}>
                <boxGeometry args={[0.06, 0.05, 0.03]} />
                <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
              </mesh>
            </group>
          </mesh>
          <pointLight
            ref={keyGlowRef}
            position={keyPosition}
            color="#ffd700"
            intensity={3}
            distance={4}
          />
        </group>
      )}

      {/* ========== SWITCH ========== */}
      <group position={[4.9, 0, 2]}>
        <mesh
          ref={switchRef}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={switchActive ? onSwitchClick : undefined}
          onPointerOver={switchActive ? () => handlePointerOver(switchHoverRef, switchRef) : undefined}
          onPointerOut={switchActive ? () => handlePointerOut(switchHoverRef, switchRef) : undefined}
        >
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial
            color={switchActive ? '#1a3a2a' : gameState.switchActivated ? '#0a2a0a' : '#1a1a1a'}
            roughness={0.5}
            emissive={switchActive ? '#00ff00' : gameState.switchActivated ? '#00aa00' : '#330000'}
            emissiveIntensity={switchActive ? 0.3 : 0.1}
          />
        </mesh>
        {/* Switch lever */}
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
        {switchActive && (
          <pointLight position={[0, 0, 0.5]} color="#00ff00" intensity={0.5} distance={2} />
        )}
      </group>

      {/* ========== DOOR ========== */}
      <group ref={doorRef} position={[0, -0.5, 4.95]}>
        <mesh
          rotation={[0, Math.PI, 0]}
          onClick={doorActive ? onDoorClick : undefined}
          onPointerOver={doorActive ? () => handlePointerOver(doorHoverRef, { current: doorRef.current?.children[0] as THREE.Mesh }) : undefined}
          onPointerOut={doorActive ? () => handlePointerOut(doorHoverRef, { current: doorRef.current?.children[0] as THREE.Mesh }) : undefined}
        >
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial
            color={doorActive ? '#2a3a2a' : '#1a1208'}
            roughness={0.7}
            emissive={doorActive ? levelConfig.pointLightColor : '#000000'}
            emissiveIntensity={doorActive ? 0.2 : 0}
          />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.7, 0, 0.1]} rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Door frame glow */}
        {doorActive && (
          <pointLight position={[0, 0, -0.5]} color={levelConfig.pointLightColor} intensity={1} distance={3} />
        )}
      </group>

      {/* Bookshelf decoration */}
      <group position={[-4.8, -0.5, -2]}>
        {[0, 0.4, 0.8, 1.2, 1.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.4]} />
            <meshStandardMaterial color="#2a1f14" roughness={0.8} />
          </mesh>
        ))}
        {/* Books */}
        {[0.1, 0.5, 0.9, 1.3].map((y, i) => (
          <group key={`books-${i}`}>
            {[...Array(5)].map((_, j) => (
              <mesh
                key={j}
                position={[0.15, y + 0.15, -0.5 + j * 0.25]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <boxGeometry args={[0.15, 0.25, 0.04]} />
                <meshStandardMaterial
                  color={['#8b0000', '#00008b', '#006400', '#8b8b00', '#4b0082'][j]}
                  roughness={0.6}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
