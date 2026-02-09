import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import { RoomObjectDef } from '../data/roomObjects';

interface RoomObjectProps {
  def: RoomObjectDef;
  role: 'question' | 'keyHider' | 'none';
  isActive: boolean;
  shouldReveal: boolean;
  onClick?: () => void;
  onRevealComplete?: () => void;
}

export default function RoomObject({
  def,
  role,
  isActive,
  shouldReveal,
  onClick,
  onRevealComplete,
}: RoomObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const revealRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const hasRevealedRef = useRef(false);

  // Hover scale animation
  useEffect(() => {
    if (!groupRef.current || !isActive) return;
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.06 : 1,
      y: hovered ? 1.06 : 1,
      z: hovered ? 1.06 : 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  }, [hovered, isActive]);

  // Reset cursor when object becomes inactive
  useEffect(() => {
    if (!isActive && hovered) {
      setHovered(false);
      document.body.style.cursor = 'default';
    }
  }, [isActive, hovered]);

  // Key reveal animation
  useEffect(() => {
    if (!shouldReveal || hasRevealedRef.current || !revealRef.current) return;
    hasRevealedRef.current = true;

    const el = revealRef.current;
    const tl = gsap.timeline({
      onComplete: () => onRevealComplete?.(),
    });

    switch (def.id) {
      case 'desk':
        tl.to(el.position, { z: 1.1, duration: 1.2, ease: 'power2.out' });
        break;
      case 'bookshelf':
        tl.to(el.position, { z: 0.3, duration: 1.0, ease: 'power2.out' });
        break;
      case 'painting':
        tl.to(el.position, { y: 0.8, duration: 1.5, ease: 'power2.out' });
        break;
      case 'cabinet':
        tl.to(el.position, { x: -0.6, duration: 1.2, ease: 'power2.out' });
        break;
      case 'chest':
        tl.to(el.rotation, { x: -Math.PI / 3, duration: 1.0, ease: 'power2.out' });
        break;
      case 'crate':
        tl.to(el.position, { y: 0.5, duration: 1.0, ease: 'power2.out' });
        break;
      case 'barrel':
        tl.to(el.rotation, { x: Math.PI / 6, duration: 1.2, ease: 'power2.out' });
        break;
      default:
        onRevealComplete?.();
        break;
    }
  }, [shouldReveal, def.id, onRevealComplete]);

  const handlePointerOver = useCallback(() => {
    if (!isActive) return;
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, [isActive]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleClick = useCallback(() => {
    if (!isActive || !onClick) return;
    onClick();
  }, [isActive, onClick]);

  const hintText =
    role === 'question' ? def.questionHint : role === 'keyHider' ? def.keyHint : '';

  return (
    <group
      ref={groupRef}
      position={def.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <ObjectGeometry id={def.id} revealRef={revealRef} />

      {/* Hover hint tooltip */}
      {hovered && isActive && hintText && (
        <Html
          position={[0, 1.5, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-3 py-1.5 rounded bg-background/80 border border-primary/30 font-mono text-xs text-primary whitespace-nowrap backdrop-blur-sm">
            {hintText}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================
// Object Geometries
// ============================================================

function ObjectGeometry({ id, revealRef }: { id: string; revealRef: React.MutableRefObject<any> }) {
  switch (id) {
    case 'desk':
      return <DeskGeometry revealRef={revealRef} />;
    case 'bookshelf':
      return <BookshelfGeometry revealRef={revealRef} />;
    case 'painting':
      return <PaintingGeometry revealRef={revealRef} />;
    case 'cabinet':
      return <CabinetGeometry revealRef={revealRef} />;
    case 'chest':
      return <ChestGeometry revealRef={revealRef} />;
    case 'clock':
      return <ClockGeometry />;
    case 'crate':
      return <CrateGeometry revealRef={revealRef} />;
    case 'barrel':
      return <BarrelGeometry revealRef={revealRef} />;
    case 'table':
      return <TableGeometry />;
    case 'chair':
      return <ChairGeometry />;
    case 'stool':
      return <StoolGeometry />;
    default:
      return null;
  }
}

const WOOD_DARK = '#1a1208';
const WOOD_MED = '#2a1f14';
const WOOD_LIGHT = '#3a2f24';
const METAL = '#555555';

function DeskGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Drawer */}
      <mesh ref={revealRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.7]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.3, 0.41]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

const BOOK_COLORS = ['#8b0000', '#00008b', '#006400', '#8b8b00', '#4b0082'];

function BookshelfGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0.18, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.5, 2, 0.05]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>
      {/* Shelves */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.5, 0.05, 0.4]} />
          <meshStandardMaterial color={WOOD_MED} roughness={0.8} />
        </mesh>
      ))}
      {/* Books */}
      {[0.1, 0.5, 0.9, 1.3].map((y, shelfIdx) => (
        <group key={`shelf-${shelfIdx}`}>
          {BOOK_COLORS.map((color, j) => (
            <mesh
              key={j}
              ref={shelfIdx === 1 && j === 2 ? revealRef : undefined}
              position={[0.05, y + 0.15, -0.5 + j * 0.25]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.15, 0.25, 0.04]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function PaintingGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group ref={revealRef} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.5, 1, 0.08]} />
        <meshStandardMaterial color="#4a3520" roughness={0.5} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.3, 0.8, 0.02]} />
        <meshStandardMaterial color="#1a1520" roughness={0.4} />
      </mesh>
    </group>
  );
}

function CabinetGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.8, 0.5]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      {/* Door */}
      <mesh ref={revealRef} position={[0, 0, 0.26]}>
        <boxGeometry args={[0.7, 1.6, 0.05]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[-0.2, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function ChestGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1, 0.5, 0.6]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      {/* Lid (pivots from back) */}
      <group position={[0, 0.4, -0.3]}>
        <mesh ref={revealRef} position={[0, 0.05, 0.3]}>
          <boxGeometry args={[1.02, 0.08, 0.62]} />
          <meshStandardMaterial color={WOOD_MED} roughness={0.6} />
        </mesh>
      </group>
      {/* Metal band */}
      <mesh position={[0, 0.15, 0.31]}>
        <boxGeometry args={[1.02, 0.08, 0.02]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ClockGeometry() {
  return (
    <group>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.6} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.1, 0.06]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.3} />
      </mesh>
      {/* Hour hand */}
      <mesh position={[0, 0.15, 0.07]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.12, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Minute hand */}
      <mesh position={[0, 0.14, 0.07]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.015, 0.18, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function CrateGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
      </mesh>
      {/* Lid */}
      <mesh ref={revealRef} position={[0, 0.46, 0]}>
        <boxGeometry args={[0.85, 0.06, 0.85]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Slats */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.41]}>
          <boxGeometry args={[0.06, 0.5, 0.02]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function BarrelGeometry({ revealRef }: { revealRef: React.MutableRefObject<any> }) {
  return (
    <group ref={revealRef}>
      {/* Cylinder body */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1.2, 12]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Metal bands */}
      {[-0.35, 0, 0.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.38, 0.02, 6, 16]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function TableGeometry() {
  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.8, 0, -0.5], [0.8, 0, -0.5], [-0.8, 0, 0.5], [0.8, 0, 0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function ChairGeometry() {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.35, -0.22]}>
        <boxGeometry args={[0.5, 0.65, 0.06]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.2, -0.35, -0.2], [0.2, -0.35, -0.2], [-0.2, -0.35, 0.2], [0.2, -0.35, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.05, 0.65, 0.05]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function StoolGeometry() {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.06, 10]} />
        <meshStandardMaterial color={WOOD_MED} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.15, -0.3, Math.cos(angle) * 0.15]}
          rotation={[Math.sin(angle) * 0.15, 0, -Math.cos(angle) * 0.15]}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
