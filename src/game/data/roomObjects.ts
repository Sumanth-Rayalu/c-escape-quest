export interface RoomObjectDef {
  id: string;
  name: string;
  position: [number, number, number];
  canHoldQuestions: boolean;
  canHideKey: boolean;
  questionHint: string;
  keyHint: string;
  /** World position where the key mesh appears when hidden by this object */
  keyWorldPosition?: [number, number, number];
}

export const roomObjects: RoomObjectDef[] = [
  // --- Interactive objects ---
  {
    id: 'desk',
    name: 'Desk',
    position: [3.5, -1.8, -4.3],
    canHoldQuestions: true,
    canHideKey: true,
    questionHint: 'There are papers scattered on this desk...',
    keyHint: 'The drawer feels jammed. Something is inside...',
    keyWorldPosition: [3.5, -1.5, -3.6],
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    position: [-4.8, -0.5, -2],
    canHoldQuestions: true,
    canHideKey: true,
    questionHint: 'One of these books looks out of place...',
    keyHint: 'A book is sticking out slightly...',
    keyWorldPosition: [-4.3, -0.2, -2],
  },
  {
    id: 'painting',
    name: 'Painting',
    position: [-4.95, 0.5, 2],
    canHoldQuestions: true,
    canHideKey: true,
    questionHint: 'The frame has strange markings...',
    keyHint: 'The painting is slightly loose on one side...',
    keyWorldPosition: [-4.5, 0.2, 2],
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    position: [4.6, -1.2, -2],
    canHoldQuestions: true,
    canHideKey: true,
    questionHint: 'There is a note taped inside the glass...',
    keyHint: 'The cabinet door won\'t close all the way...',
    keyWorldPosition: [4.0, -1.5, -2],
  },
  {
    id: 'chest',
    name: 'Chest',
    position: [-3.5, -2.2, -4],
    canHoldQuestions: true,
    canHideKey: true,
    questionHint: 'Something is engraved on the lid...',
    keyHint: 'The chest rattles when moved...',
    keyWorldPosition: [-3.5, -1.8, -4],
  },
  {
    id: 'clock',
    name: 'Wall Clock',
    position: [0, 1.5, -4.9],
    canHoldQuestions: true,
    canHideKey: false,
    questionHint: 'The clock face has symbols instead of numbers...',
    keyHint: '',
  },
  {
    id: 'crate',
    name: 'Crate',
    position: [3.5, -2.2, 3],
    canHoldQuestions: false,
    canHideKey: true,
    questionHint: '',
    keyHint: 'The crate lid is slightly ajar...',
    keyWorldPosition: [3.5, -1.8, 3],
  },
  {
    id: 'barrel',
    name: 'Barrel',
    position: [-4, -1.6, 3.5],
    canHoldQuestions: false,
    canHideKey: true,
    questionHint: '',
    keyHint: 'Something is hidden beneath the barrel...',
    keyWorldPosition: [-4, -2.3, 3.8],
  },

  // --- Decorative only ---
  {
    id: 'table',
    name: 'Table',
    position: [2, -1.8, 0],
    canHoldQuestions: false,
    canHideKey: false,
    questionHint: '',
    keyHint: '',
  },
  {
    id: 'chair',
    name: 'Chair',
    position: [0.5, -2.0, 0.5],
    canHoldQuestions: false,
    canHideKey: false,
    questionHint: '',
    keyHint: '',
  },
  {
    id: 'stool',
    name: 'Stool',
    position: [-2, -2.1, 2],
    canHoldQuestions: false,
    canHideKey: false,
    questionHint: '',
    keyHint: '',
  },
];
