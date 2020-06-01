import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';

import { Status, Difficulty } from '../utils/constants';
import {
  generateSudoku,
  buildPossibleNumberGrid,
  ICasePossibilities,
} from '../utils/generator';

export interface State {
  difficulty: Difficulty;
  selectedIndex: number;
  puzzle: number[]; // Initial grid
  values: number[]; // Current grid
  solution: number[]; // Solution grid
  possibleNumbersGrid: ICasePossibilities[]; // Possible numbers per case
  rate: number;
  errors: number[];
  status: Status;
  elapsedTime: number;
}

const defaultSelectedIndex: number = 40;

const ensureSelectedIndex = (selectedIndex) =>
  typeof selectedIndex === 'number' ? selectedIndex : defaultSelectedIndex;

const getErrors = ({
  solution,
  values,
}: {
  solution: number[];
  values: number[];
}): number[] =>
  solution.reduce((errors, solValue, index) => {
    if (values[index] !== null && values[index] !== solValue)
      errors.push(index);
    return errors;
  }, []);

const initialStateDefault: State = {
  difficulty: undefined,
  selectedIndex: undefined,
  puzzle: [],
  values: [],
  solution: [],
  possibleNumbersGrid: undefined,
  rate: undefined,
  errors: [],
  status: Status.Pending,
  elapsedTime: 0,
};

const reducers = {
  startGame: (state: State, action: PayloadAction<Difficulty>) => {
    const { puzzle, solution, rate } = generateSudoku(action.payload);

    return {
      ...state,
      difficulty: action.payload,
      elapsedTime: 0,
      possibleNumbersGrid: buildPossibleNumberGrid({
        gridValues: [...puzzle],
        puzzle,
      }),
      puzzle,
      rate,
      selectedIndex: defaultSelectedIndex,
      solution,
      status: Status.Playing,
      values: [...puzzle],
    };
  },
  playGame: (state: State) => ({ ...state, status: Status.Playing }),
  pauseGame: (state: State) => ({ ...state, status: Status.Paused }),
  stopGame: (state: State) => ({
    ...state,
    status: Status.Pending,
    solution: [],
    puzzle: [],
    values: [],
    rate: undefined,
  }),
  moveUp: (state: State) => {
    const selectedIndex = ensureSelectedIndex(state.selectedIndex);

    return {
      ...state,
      selectedIndex:
        selectedIndex - 9 >= 0 ? selectedIndex - 9 : selectedIndex + 72,
    };
  },
  moveDown: (state: State) => {
    const selectedIndex = ensureSelectedIndex(state.selectedIndex);

    return {
      ...state,
      selectedIndex:
        selectedIndex + 9 >= 81 ? selectedIndex - 72 : selectedIndex + 9,
    };
  },
  moveRight: (state: State) => {
    const selectedIndex = ensureSelectedIndex(state.selectedIndex);

    return {
      ...state,
      selectedIndex:
        (selectedIndex + 1) % 9 ? selectedIndex + 1 : selectedIndex - 8,
    };
  },
  moveLeft: (state: State) => {
    const selectedIndex = ensureSelectedIndex(state.selectedIndex);

    return {
      ...state,
      selectedIndex:
        (selectedIndex + 9) % 9 ? selectedIndex - 1 : selectedIndex + 8,
    };
  },
  clickCase: (state: State, action: PayloadAction<number>) => ({
    ...state,
    selectedIndex:
      action.payload === state.selectedIndex ? undefined : action.payload,
  }),
  fillCase: (state: State, action: PayloadAction<number>) => {
    if (state.selectedIndex !== undefined) {
      const values = [...state.values];
      let status = state.status;
      // Unset the error for this index
      let errors = state.errors.filter((i) => i !== state.selectedIndex);

      // Set the value if not an initial value
      if (state.puzzle[state.selectedIndex] === null) {
        values[state.selectedIndex] = action.payload;
      }

      const possibleNumbersGrid = buildPossibleNumberGrid({
        gridValues: values,
        puzzle: state.puzzle,
      });

      const isCompleted = values.filter((v) => v).length === 81;

      if (isCompleted) {
        errors = getErrors({ solution: state.solution, values });

        if (errors.length === 0) {
          // You win!
          status = Status.Completed;
        }
      }

      return {
        ...state,
        errors,
        possibleNumbersGrid,
        status,
        values,
      };
    }
  },
  checkGame: (state: State) => ({
    ...state,
    errors: getErrors({ solution: state.solution, values: state.values }),
  }),
  setElapsedTime: (state: State, action: PayloadAction<number>) => ({
    ...state,
    elapsedTime: action.payload,
  }),
  showOneMoreClue: (state: State) => {
    const [
      nextHiddenClueIndex,
    ]: number[] = state.possibleNumbersGrid
      .map((clue, index) =>
        clue.level !== null && !clue.isVisible ? index : null
      )
      .filter((i) => i);

    if (!nextHiddenClueIndex) {
      window.alert(
        "Désolé, il n'y a plus aucune case à découvrir sans faire un pari entre plusieurs chiffres possibles. Bonne chance !"
      );
    } else {
      state.possibleNumbersGrid[nextHiddenClueIndex].isVisible = true;
      state.selectedIndex = nextHiddenClueIndex;
    }
  },
  [HYDRATE]: (state: State, action: PayloadAction<any>) => {
    // TODO Attention! This will overwrite client state! Real apps should use proper reconciliation.
    return {
      ...state,
      ...action.payload,
    };
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialStateDefault,
  reducers,
});

// eslint-disable-next-line no-unused-vars
const makeStore: MakeStore<State> = (context: Context) =>
  configureStore({ reducer: gameSlice.reducer });

export const gameWrapper = createWrapper<State>(makeStore, { debug: true });

export default gameSlice;
