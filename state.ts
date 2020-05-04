import { STATUS } from './utils/constants';
import { generateSudoku } from './utils/generator';

export enum ActionType {
  Start = 'Start',
  Stop = 'Stop',
  Play = 'Play',
  Pause = 'Pause',
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  Click = 'Click',
  Number = 'Number',
  Check = 'Check',
  SetElapsedTime = 'SetElapsedTime',
}

interface State {
  selectedIndex: number;
  puzzle: number[];
  values: number[];
  solution: number[];
  rate: number;
  errors: number[];
  status: string;
  elapsedTime: number;
}

interface Action {
  type: ActionType;
  value?: any;
}

interface NumberAction {
  type: ActionType.Number;
  value: number;
}

export const reducer = (state: State, action: Action | NumberAction): State => {
  const defaultSelectedIndex: number = 40;

  // console.log(action);

  if (
    [
      ActionType.Up,
      ActionType.Down,
      ActionType.Left,
      ActionType.Right,
    ].includes(action.type) &&
    state.selectedIndex === undefined
  ) {
    return {
      ...state,
      selectedIndex: defaultSelectedIndex,
    };
  }

  switch (action.type) {
    case ActionType.Start:
      const { puzzle, solution, rate } = generateSudoku(action.value);

      return {
        ...state,
        puzzle,
        values: [...puzzle],
        solution,
        rate,
        status: STATUS.PLAYING,
      };
    case ActionType.Play:
      return {
        ...state,
        status: STATUS.PLAYING,
      };
    case ActionType.Stop:
      return {
        ...state,
        status: STATUS.PENDING,
        solution: [],
        puzzle: [],
        values: [],
        rate: undefined,
      };
    case ActionType.Pause:
      return {
        ...state,
        status: STATUS.PAUSED,
      };
    case ActionType.Up:
      return {
        ...state,
        selectedIndex:
          state.selectedIndex - 9 >= 0
            ? state.selectedIndex - 9
            : state.selectedIndex + 72,
      };
    case ActionType.Down:
      return {
        ...state,
        selectedIndex:
          state.selectedIndex + 9 >= 80
            ? state.selectedIndex - 72
            : state.selectedIndex + 9,
      };
    case ActionType.Right:
      return {
        ...state,
        selectedIndex:
          (state.selectedIndex + 1) % 9
            ? state.selectedIndex + 1
            : state.selectedIndex - 8,
      };
    case ActionType.Left:
      return {
        ...state,
        selectedIndex:
          (state.selectedIndex + 9) % 9
            ? state.selectedIndex - 1
            : state.selectedIndex + 8,
      };
    case ActionType.Click:
      return {
        ...state,
        selectedIndex:
          action.value === state.selectedIndex ? undefined : action.value,
      };
    case ActionType.Number:
      if (state.selectedIndex !== undefined) {
        const values = [...state.values];
        // Unset the error for this index
        const errors = state.errors.filter((i) => i !== state.selectedIndex);

        // Set the value if not an initial value
        if (state.puzzle[state.selectedIndex] === null) {
          values[state.selectedIndex] = action.value;
        }

        return {
          ...state,
          errors,
          values,
        };
      }
      return { ...state };
    case ActionType.Check:
      return {
        ...state,
        errors: state.solution.reduce((errors, solValue, index) => {
          if (state.values[index] !== null && state.values[index] !== solValue)
            errors.push(index);
          return errors;
        }, []),
      };
    case ActionType.SetElapsedTime:
      return { ...state, elapsedTime: action.value };

    default:
      console.error(`Unknown action type '${JSON.stringify(action)}'`);

      return { ...state };
  }
};
