export const STATUS = {
  PENDING: 'PENDING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

export const DIFFICULTY = {
  EASY: 'EASY',
  AVERAGE: 'AVERAGE',
  HARD: 'HARD',
  INSANE: 'INSANE',
};

export const DIFFICULTY_OPTIONS = [
  { value: DIFFICULTY.EASY, label: 'Facile', maxRate: 0.5 },
  { value: DIFFICULTY.AVERAGE, label: 'Moyen', maxRate: 1.5 },
  { value: DIFFICULTY.HARD, label: 'Difficile', maxRate: 2 },
  { value: DIFFICULTY.INSANE, label: 'Horrible', maxRate: 3 },
];
