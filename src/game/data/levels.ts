export interface LevelConfig {
  level: number;
  name: string;
  ambientColor: string;
  ambientIntensity: number;
  pointLightColor: string;
  pointLightIntensity: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  keyRevealType: 'table' | 'drawer' | 'painting' | 'floor' | 'wall';
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export const levelConfigs: LevelConfig[] = [
  {
    level: 1,
    name: 'The Awakening',
    ambientColor: '#2ecc71',
    ambientIntensity: 0.3,
    pointLightColor: '#2ecc71',
    pointLightIntensity: 1.5,
    wallColor: '#1a2a1a',
    floorColor: '#0d1a0d',
    ceilingColor: '#142014',
    keyRevealType: 'table',
    fogColor: '#0a140a',
    fogNear: 5,
    fogFar: 20,
  },
  {
    level: 2,
    name: 'The Depths',
    ambientColor: '#3498db',
    ambientIntensity: 0.25,
    pointLightColor: '#3498db',
    pointLightIntensity: 1.8,
    wallColor: '#1a1a2a',
    floorColor: '#0d0d1a',
    ceilingColor: '#141420',
    keyRevealType: 'drawer',
    fogColor: '#0a0a14',
    fogNear: 4,
    fogFar: 18,
  },
  {
    level: 3,
    name: 'The Void',
    ambientColor: '#9b59b6',
    ambientIntensity: 0.2,
    pointLightColor: '#9b59b6',
    pointLightIntensity: 2.0,
    wallColor: '#2a1a2a',
    floorColor: '#1a0d1a',
    ceilingColor: '#201420',
    keyRevealType: 'painting',
    fogColor: '#140a14',
    fogNear: 3,
    fogFar: 16,
  },
  {
    level: 4,
    name: 'The Furnace',
    ambientColor: '#e67e22',
    ambientIntensity: 0.3,
    pointLightColor: '#e67e22',
    pointLightIntensity: 2.2,
    wallColor: '#2a1a0d',
    floorColor: '#1a0d06',
    ceilingColor: '#201408',
    keyRevealType: 'floor',
    fogColor: '#140a05',
    fogNear: 4,
    fogFar: 17,
  },
  {
    level: 5,
    name: 'The Final Gate',
    ambientColor: '#e74c3c',
    ambientIntensity: 0.2,
    pointLightColor: '#e74c3c',
    pointLightIntensity: 2.5,
    wallColor: '#2a0d0d',
    floorColor: '#1a0606',
    ceilingColor: '#200808',
    keyRevealType: 'wall',
    fogColor: '#140505',
    fogNear: 3,
    fogFar: 15,
  },
];
