import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';

import { Status, Difficulty } from '../utils/constants';
import {
  generateSudoku,
  buildPossibleNumberGrid,
  ICasePossibilities,
} from '../utils/generator';

export type GridHistoryItem = [number, number]; // [index, value]

export interface StateDebug {
  showPossibilities: boolean;
}

export interface State {
  difficulty: Difficulty;
  elapsedTime: number;
  gridErrors: number[];
  gridHistory: GridHistoryItem[];
  gridPossibilities: ICasePossibilities[]; // Possible numbers per case
  gridProblem: number[]; // Initial grid
  gridProblemRate: number;
  gridSolution: number[]; // Solution grid
  gridValues: number[]; // Current grid
  selectedIndex: number;
  status: Status;
  debug: StateDebug;
}

const defaultSelectedIndex: number = 40;

const ensureSelectedIndex = (selectedIndex) =>
  typeof selectedIndex === 'number' ? selectedIndex : defaultSelectedIndex;

const getErrors = ({
  gridSolution,
  gridValues,
}: {
  gridSolution: number[];
  gridValues: number[];
}): number[] =>
  gridSolution.reduce((gridErrors, solValue, index) => {
    if (gridValues[index] !== null && gridValues[index] !== solValue)
      gridErrors.push(index);
    return gridErrors;
  }, []);

const initialStateDefault: State = {
  difficulty: undefined,
  elapsedTime: 0,
  gridErrors: [],
  gridHistory: [],
  gridPossibilities: undefined,
  gridProblem: [],
  gridProblemRate: undefined,
  gridSolution: [],
  gridValues: [],
  selectedIndex: undefined,
  status: Status.Pending,
  debug: {
    showPossibilities: false,
  },
};

const reducers = {
  startGame: (state: State, action: PayloadAction<Difficulty>) => {
    const { gridProblem, gridSolution, gridProblemRate } = generateSudoku(
      action.payload
    );

    return {
      ...state,
      difficulty: action.payload,
      elapsedTime: 0,
      gridPossibilities: buildPossibleNumberGrid({
        gridValues: [...gridProblem],
      }),
      gridProblem,
      gridProblemRate,
      selectedIndex: defaultSelectedIndex,
      gridSolution,
      status: Status.Playing,
      gridValues: [...gridProblem],
    };
  },
  playGame: (state: State) => ({ ...state, status: Status.Playing }),
  pauseGame: (state: State) => ({ ...state, status: Status.Paused }),
  stopGame: (state: State) => ({
    ...state,
    status: Status.Pending,
    gridSolution: [],
    gridProblem: [],
    gridValues: [],
    gridProblemRate: undefined,
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
      const gridHistory = [...state.gridHistory];
      const gridValues = [...state.gridValues];
      let status = state.status;
      // Unset the error for this index
      let gridErrors = state.gridErrors.filter(
        (i) => i !== state.selectedIndex
      );

      // Set the value if not an initial value
      if (state.gridProblem[state.selectedIndex] === null) {
        gridValues[state.selectedIndex] = action.payload;
        gridHistory.push([state.selectedIndex, action.payload]);
      }

      const gridPossibilities = buildPossibleNumberGrid({
        gridValues: gridValues,
      });

      const isCompleted = gridValues.filter((v) => v).length === 81;

      if (isCompleted) {
        gridErrors = getErrors({
          gridSolution: state.gridSolution,
          gridValues,
        });

        if (gridErrors.length === 0) {
          // You win!
          status = Status.Completed;
        }
      }

      return {
        ...state,
        gridErrors,
        gridHistory,
        gridPossibilities,
        gridValues,
        status,
      };
    }
  },
  undoFillCase: (state: State) => {
    const gridHistory = [...state.gridHistory];
    const gridValues = [...state.gridValues];
    let selectedIndex = state.selectedIndex;

    const [caseIndexToUndo] = gridHistory.pop() || [];

    if (typeof caseIndexToUndo === 'number') {
      gridValues[caseIndexToUndo] = null;
      selectedIndex = caseIndexToUndo;
    }

    const [caseIndexToRestore, caseValueToRestore] =
      gridHistory[gridHistory.length - 1] || [];

    if (typeof caseIndexToRestore === 'number') {
      gridValues[caseIndexToRestore] = caseValueToRestore;
      selectedIndex = caseIndexToRestore;
    }

    const gridPossibilities = buildPossibleNumberGrid({
      gridValues,
    });

    return {
      ...state,
      gridErrors: [],
      gridHistory,
      gridPossibilities,
      gridValues,
      selectedIndex,
    };
  },
  checkGame: (state: State) => ({
    ...state,
    gridErrors: getErrors({
      gridSolution: state.gridSolution,
      gridValues: state.gridValues,
    }),
  }),
  setElapsedTime: (state: State, action: PayloadAction<number>) => ({
    ...state,
    elapsedTime: action.payload,
  }),
  showOneMoreClue: (state: State) => {
    const [
      nextHiddenClueIndex,
    ]: number[] = state.gridPossibilities
      .map((clue, index) =>
        clue.level !== null && !clue.isVisible ? index : null
      )
      .filter((i) => i);

    if (!nextHiddenClueIndex) {
      window.alert(
        "Désolé, il n'y a plus aucune case à découvrir sans faire un pari entre plusieurs chiffres possibles. Bonne chance !"
      );
    } else {
      state.gridPossibilities[nextHiddenClueIndex].isVisible = true;
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
