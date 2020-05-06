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
  let newState: State = { ...state };

  // console.log(action);

  if (
    [
      ActionType.Up,
      ActionType.Down,
      ActionType.Left,
      ActionType.Right,
    ].includes(action.type) &&
    newState.selectedIndex === undefined
  ) {
    newState.selectedIndex = defaultSelectedIndex;
  }

  switch (action.type) {
    case ActionType.Start:
      const { puzzle, solution, rate } = generateSudoku(action.value);

      newState = {
        ...newState,
        puzzle,
        values: [...puzzle],
        solution,
        rate,
        status: STATUS.PLAYING,
      };
      break;
    case ActionType.Play:
      newState.status = STATUS.PLAYING;
      break;
    case ActionType.Stop:
      newState = {
        ...newState,
        status: STATUS.PENDING,
        solution: [],
        puzzle: [],
        values: [],
        rate: undefined,
      };
      break;
    case ActionType.Pause:
      newState = {
        ...newState,
        status: STATUS.PAUSED,
      };
      break;
    case ActionType.Up:
      newState = {
        ...newState,
        selectedIndex:
          newState.selectedIndex - 9 >= 0
            ? newState.selectedIndex - 9
            : newState.selectedIndex + 72,
      };
      break;
    case ActionType.Down:
      newState = {
        ...newState,
        selectedIndex:
          newState.selectedIndex + 9 >= 80
            ? newState.selectedIndex - 72
            : newState.selectedIndex + 9,
      };
      break;
    case ActionType.Right:
      newState = {
        ...newState,
        selectedIndex:
          (newState.selectedIndex + 1) % 9
            ? newState.selectedIndex + 1
            : newState.selectedIndex - 8,
      };
      break;
    case ActionType.Left:
      newState = {
        ...newState,
        selectedIndex:
          (newState.selectedIndex + 9) % 9
            ? newState.selectedIndex - 1
            : newState.selectedIndex + 8,
      };
      break;
    case ActionType.Click:
      newState = {
        ...newState,
        selectedIndex:
          action.value === newState.selectedIndex ? undefined : action.value,
      };
      break;
    case ActionType.Number:
      if (newState.selectedIndex !== undefined) {
        const values = [...newState.values];
        // Unset the error for this index
        const errors = newState.errors.filter(
          (i) => i !== newState.selectedIndex
        );

        // Set the value if not an initial value
        if (newState.puzzle[newState.selectedIndex] === null) {
          values[newState.selectedIndex] = action.value;
        }

        newState = {
          ...newState,
          errors,
          values,
        };
      }
      break;
    case ActionType.Check:
      newState = {
        ...newState,
        errors: newState.solution.reduce((errors, solValue, index) => {
          if (
            newState.values[index] !== null &&
            newState.values[index] !== solValue
          )
            errors.push(index);
          return errors;
        }, []),
      };
      break;
    case ActionType.SetElapsedTime:
      newState = {
        ...newState,
        elapsedTime: action.value,
      };
      break;

    default:
      console.error(`Unknown action type '${JSON.stringify(action)}'`);
      break;
  }

  // Save the new state in localstorage
  window.localStorage.setItem('state', JSON.stringify(newState));

  return newState;
};
