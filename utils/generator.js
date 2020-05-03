import sudoku from 'sudoku';

import { DIFFICULTY_OPTIONS } from '../utils/constants';

const _generateSudoku = () => {
  const puzzle = sudoku.makepuzzle();
  const solution = sudoku.solvepuzzle(puzzle);
  const rate = sudoku.ratepuzzle(puzzle, 4); // TODO Adjust sample

  console.log('_generateSudoku() - rate: ', rate);

  return {
    puzzle: puzzle.map((v) => (v !== null ? v + 1 : null)),
    solution: solution.map((v) => v + 1),
    rate,
  };
};

export const generateSudoku = (difficulty) => {
  const difficultyIndex = DIFFICULTY_OPTIONS.findIndex(
    (option) => option.value === difficulty
  );
  const { maxRate } = DIFFICULTY_OPTIONS[difficultyIndex];
  const minRate =
    difficultyIndex > 0 ? DIFFICULTY_OPTIONS[difficultyIndex - 1].maxRate : 0;

  let _sudoku = _generateSudoku();

  console.log('maxRate: ', maxRate);

  while (_sudoku.rate < minRate || _sudoku.rate >= maxRate) {
    _sudoku = _generateSudoku();
  }

  return _sudoku;
};
