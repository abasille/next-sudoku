import { STATUS } from './utils/constants';
import { generateSudoku } from './utils/generator';

export const reducer = (state, action) => {
  const defaultSelectedIndex = 40;

  // console.log(action);

  if (
    ['up', 'down', 'left', 'right'].includes(action.type) &&
    state.selectedIndex === undefined
  ) {
    return {
      ...state,
      selectedIndex: defaultSelectedIndex,
    };
  }

  switch (action.type) {
    case 'start':
      const { puzzle, solution, rate } = generateSudoku(action.value);

      return {
        ...state,
        puzzle,
        values: [...puzzle],
        solution,
        rate,
        status: STATUS.PLAYING,
      };
    case 'play':
      return {
        ...state,
        status: STATUS.PLAYING,
      };
    case 'stop':
      return {
        ...state,
        status: STATUS.PENDING,
        solution: [],
        puzzle: [],
        values: [],
        rate: undefined,
      };
    case 'pause':
      return {
        ...state,
        status: STATUS.PAUSED,
      };
    case 'up':
      return {
        ...state,
        selectedIndex:
          state.selectedIndex - 9 >= 0
            ? state.selectedIndex - 9
            : state.selectedIndex + 72,
      };
    case 'down':
      return {
        ...state,
        selectedIndex:
          state.selectedIndex + 9 >= 80
            ? state.selectedIndex - 72
            : state.selectedIndex + 9,
      };
    case 'right':
      return {
        ...state,
        selectedIndex:
          (state.selectedIndex + 1) % 9
            ? state.selectedIndex + 1
            : state.selectedIndex - 8,
      };
    case 'left':
      return {
        ...state,
        selectedIndex:
          (state.selectedIndex + 9) % 9
            ? state.selectedIndex - 1
            : state.selectedIndex + 8,
      };
    case 'click':
      return {
        ...state,
        selectedIndex:
          action.value === state.selectedIndex ? undefined : action.value,
      };
    case 'number':
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
    case 'check':
      return {
        ...state,
        errors: state.solution.reduce((errors, solValue, index) => {
          if (state.values[index] !== null && state.values[index] !== solValue)
            errors.push(index);
          return errors;
        }, []),
      };
    case 'setElapsedTime':
      return { ...state, elapsedTime: action.value };
    default:
      throw new Error(`Unknown action type '${action.type}'`);
  }
};
