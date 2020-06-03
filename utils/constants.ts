export enum Status {
  Pending = 'Pending',
  Playing = 'Playing',
  Paused = 'Paused',
  Completed = 'Completed',
}

export enum Difficulty {
  Easy = 'Easy',
  Average = 'Average',
  Hard = 'Hard',
  Insane = 'Insane',
}

export const DIFFICULTY_OPTIONS: Array<{
  value: Difficulty;
  label: string;
  maxRate: number;
}> = [
  { value: Difficulty.Easy, label: 'Facile', maxRate: 0.5 },
  { value: Difficulty.Average, label: 'Moyen', maxRate: 1.5 },
  { value: Difficulty.Hard, label: 'Difficile', maxRate: 2 },
  { value: Difficulty.Insane, label: 'Cauchemardesque', maxRate: 3 },
];

export const FILL_COLORS = ['black', 'purple', 'blue', 'orange'];
