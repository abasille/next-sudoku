import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';

import { Status, Difficulty } from '../utils/constants';
import {
  generateSudoku,
  buildPossibleNumberGrid,
  ICasePossibilities,
} from '../utils/generator';

export interface State {
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

const initialStateDefault: State = {
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
      puzzle,
      values: [...puzzle],
      possibleNumbersGrid: buildPossibleNumberGrid({
        gridValues: [...puzzle],
        puzzle,
      }),
      solution,
      rate,
      status: Status.Playing,
      elapsedTime: 0,
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
    const selectedIndex = state.selectedIndex || defaultSelectedIndex;

    return {
      ...state,
      selectedIndex:
        selectedIndex - 9 >= 0 ? selectedIndex - 9 : selectedIndex + 72,
    };
  },
  moveDown: (state: State) => {
    const selectedIndex = state.selectedIndex || defaultSelectedIndex;

    return {
      ...state,
      selectedIndex:
        selectedIndex + 9 >= 81 ? selectedIndex - 72 : selectedIndex + 9,
    };
  },
  moveRight: (state: State) => {
    const selectedIndex = state.selectedIndex || defaultSelectedIndex;

    return {
      ...state,
      selectedIndex:
        (selectedIndex + 1) % 9 ? selectedIndex + 1 : selectedIndex - 8,
    };
  },
  moveLeft: (state: State) => {
    const selectedIndex = state.selectedIndex || defaultSelectedIndex;

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
      // Unset the error for this index
      const errors = state.errors.filter((i) => i !== state.selectedIndex);

      // Set the value if not an initial value
      if (state.puzzle[state.selectedIndex] === null) {
        values[state.selectedIndex] = action.payload;
      }

      return {
        ...state,
        possibleNumbersGrid: buildPossibleNumberGrid({
          gridValues: values,
          puzzle: state.puzzle,
        }),
        errors,
        values,
      };
    }
  },
  checkGame: (state: State) => ({
    ...state,
    errors: state.solution.reduce((errors, solValue, index) => {
      if (state.values[index] !== null && state.values[index] !== solValue)
        errors.push(index);
      return errors;
    }, []),
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
