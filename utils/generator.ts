import sudoku from 'sudoku';

import { DIFFICULTY_OPTIONS, Difficulty } from './constants';
import { getColumnIndexes, getColumnIndex } from '../api/columnHelpers';
import { getLineIndexes, getLineIndex } from '../api/lineHelpers';
import { getSquareIndexes, getSquareIndex } from '../api/squareHelpers';

interface ISudoku {
  gridProblem: number[];
  gridSolution: number[];
  gridProblemRate: number;
}

const _generateSudoku = (): ISudoku => {
  const gridProblem = sudoku.makepuzzle();
  const gridSolution = sudoku.solvepuzzle(gridProblem);
  const gridProblemRate = sudoku.ratepuzzle(gridProblem, 4); // TODO Adjust sample

  console.log('_generateSudoku() - gridProblemRate: ', gridProblemRate);

  return {
    gridProblem: gridProblem.map((v) => (v !== null ? v + 1 : null)),
    gridSolution: gridSolution.map((v) => v + 1),
    gridProblemRate,
  };
};

const _generateEasySudoku = (levels: number[]): ISudoku => {
  const { gridSolution } = _generateSudoku();
  const gridProblem = [...gridSolution];
  const getCandidateIndexes = () =>
    gridProblem.reduce((acc, value, index) => {
      if (value !== null) acc.push(index);
      return acc;
    }, []);

  let candidateCaseIndexes = getCandidateIndexes(); // indexes we could remove in a loop

  while (candidateCaseIndexes.length) {
    // Remove randomly a case from the solution
    const randomIndex = Math.round(
      Math.random() * (candidateCaseIndexes.length - 1)
    );

    // Remove this case index from candidateCaseIndexes
    const [candidateCaseIndex] = candidateCaseIndexes.splice(randomIndex, 1);
    // console.log(candidateCaseIndex, candidateCaseIndexes);
    gridProblem[candidateCaseIndex] = null;

    const possibleNumberGrid = buildPossibleNumberGrid({
      gridValues: gridProblem,
    });

    // IF the clue level is 0 for this empty case
    if (levels.includes(possibleNumberGrid[candidateCaseIndex].level)) {
      // THEN rebuild the candidateCaseIndexes & continue
      candidateCaseIndexes = getCandidateIndexes();
    } else {
      // ELSE cancel the deletion and continue
      gridProblem[candidateCaseIndex] = gridSolution[candidateCaseIndex];
    }
  }

  return { gridProblem, gridSolution, gridProblemRate: 0 };
};

export const generateSudoku = (difficulty: Difficulty): ISudoku => {
  const difficultyIndex = DIFFICULTY_OPTIONS.findIndex(
    (option) => option.value === difficulty
  );
  const { maxRate } = DIFFICULTY_OPTIONS[difficultyIndex];
  const minRate =
    difficultyIndex > 0 ? DIFFICULTY_OPTIONS[difficultyIndex - 1].maxRate : 0;

  if (difficulty === Difficulty.Easy) return _generateEasySudoku([0]);
  if (difficulty === Difficulty.Average) return _generateEasySudoku([0, 1]);

  let _sudoku = _generateSudoku();

  console.log('maxRate: ', maxRate);

  while (
    _sudoku.gridProblemRate < minRate ||
    _sudoku.gridProblemRate >= maxRate
  ) {
    _sudoku = _generateSudoku();
  }

  return _sudoku;
};

export const buildSuite = (): number[] =>
  Array.from({ length: 9 }).map((_, index) => index + 1);

export interface ICasePossibilities {
  possibleValues: number[];
  necessaryValuesFromColumn: number[];
  necessaryValuesFromLine: number[];
  necessaryValuesFromSquare: number[];
  level?: 0 | 1;
  isVisible?: boolean;
}

export const buildPossibleNumberGrid = ({
  gridValues,
}: {
  gridValues: number[];
}): ICasePossibilities[] => {
  const suite = buildSuite();

  // Build the initial grid of possible numbers
  let possibleNumberGrid: ICasePossibilities[] = gridValues.map(
    (caseValue) => ({
      possibleValues: caseValue ? [caseValue] : [...suite],
      necessaryValuesFromColumn: [],
      necessaryValuesFromLine: [],
      necessaryValuesFromSquare: [],
    })
  );

  const excludeValuesFromIndexes = ({ indexes, caseIndex }) =>
    indexes.forEach((i) => {
      if (i !== caseIndex && gridValues[i])
        possibleNumberGrid[caseIndex].possibleValues = possibleNumberGrid[
          caseIndex
        ].possibleValues.filter((v) => v !== gridValues[i]);
    });

  // For each filled case, exclude the number from the cases:
  for (let caseIndex = 0; caseIndex < 81; caseIndex += 1) {
    const indexes = [
      ...getColumnIndexes(getColumnIndex(caseIndex)), // - of the column
      ...getLineIndexes(getLineIndex(caseIndex)), // - of the row
      ...getSquareIndexes(getSquareIndex(caseIndex)), // - of the square
    ];

    excludeValuesFromIndexes({ indexes, caseIndex });
  }

  // For each filled case, exclude the possible numbers from the cases:
  for (let caseIndex = 0; caseIndex < 81; caseIndex += 1) {
    // Square
    const otherIndexesInSquare = getSquareIndexes(
      getSquareIndex(caseIndex)
    ).filter((i) => i !== caseIndex);
    const otherPossibleValuesInSquareSet = new Set(
      otherIndexesInSquare.reduce((acc: number[], i: number) => {
        acc.push(...possibleNumberGrid[i].possibleValues);
        return acc;
      }, [])
    );
    const necessaryValuesFromSquareSet = new Set(
      possibleNumberGrid[caseIndex].possibleValues
    );

    otherPossibleValuesInSquareSet.forEach((v) =>
      necessaryValuesFromSquareSet.delete(v)
    );

    possibleNumberGrid[caseIndex].necessaryValuesFromSquare = Array.from(
      necessaryValuesFromSquareSet
    );

    // Line
    const otherIndexesInLine = getLineIndexes(getLineIndex(caseIndex)).filter(
      (i) => i !== caseIndex
    );
    const otherPossibleValuesInLineSet = new Set(
      otherIndexesInLine.reduce((acc: number[], i: number) => {
        acc.push(...possibleNumberGrid[i].possibleValues);
        return acc;
      }, [])
    );
    const necessaryValuesFromLineSet = new Set(
      possibleNumberGrid[caseIndex].possibleValues
    );

    otherPossibleValuesInLineSet.forEach((v) =>
      necessaryValuesFromLineSet.delete(v)
    );

    possibleNumberGrid[caseIndex].necessaryValuesFromLine = Array.from(
      necessaryValuesFromLineSet
    );

    // Column
    const otherIndexesInColumn = getColumnIndexes(
      getColumnIndex(caseIndex)
    ).filter((i) => i !== caseIndex);
    const otherPossibleValuesInColumnSet = new Set(
      otherIndexesInColumn.reduce((acc: number[], i: number) => {
        acc.push(...possibleNumberGrid[i].possibleValues);
        return acc;
      }, [])
    );
    const necessaryValuesFromColumnSet = new Set(
      possibleNumberGrid[caseIndex].possibleValues
    );

    otherPossibleValuesInColumnSet.forEach((v) =>
      necessaryValuesFromColumnSet.delete(v)
    );

    possibleNumberGrid[caseIndex].necessaryValuesFromColumn = Array.from(
      necessaryValuesFromColumnSet
    );

    const { possibleValues } = possibleNumberGrid[caseIndex];
    const isEmptyCase = gridValues[caseIndex] === null;

    if (
      isEmptyCase &&
      (Array.from(necessaryValuesFromSquareSet).length === 1 ||
        Array.from(necessaryValuesFromColumnSet).length === 1 ||
        Array.from(necessaryValuesFromColumnSet).length === 1)
    ) {
      // Level 0: from square, line or column
      possibleNumberGrid[caseIndex].level = 0;
    } else if (isEmptyCase && possibleValues.length === 1) {
      // Level 1: from possible number
      possibleNumberGrid[caseIndex].level = 1;
    } else {
      possibleNumberGrid[caseIndex].level = null;
    }
  }

  return possibleNumberGrid;
};
