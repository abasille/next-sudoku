import Head from 'next/head';
import React, { useReducer } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import sudoku from 'sudoku';

import { Grid } from '../components/grid';

const puzzle = sudoku.makepuzzle();
const solution = sudoku.solvepuzzle(puzzle);
const difficulty = sudoku.ratepuzzle(puzzle, 4);

export default function Home() {
  const initialState = {
    selectedIndex: undefined,
    // values: matrix.reduce((values, row) => [...values, ...row], []),
    puzzle: puzzle.map((v) => (v !== null ? v + 1 : null)),
    values: puzzle.map((v) => (v !== null ? v + 1 : null)),
    solution: solution.map((v) => v + 1),
    difficulty,
    errors: [],
  };

  // State machine
  const reducer = (state, action) => {
    const defaultSelectedIndex = 40;

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
            if (
              state.values[index] !== null &&
              state.values[index] !== solValue
            )
              errors.push(index);
            return errors;
          }, []),
        };
      default:
        throw new Error(`Unknown action type '${action.type}'`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Shortkeys
  const keyMap = {
    MOVE_UP: 'up',
    MOVE_DOWN: 'down',
    MOVE_RIGHT: 'right',
    MOVE_LEFT: 'left',
    DEL: 'DEL',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    CHECK: 'v',
  };

  const handlers = {
    MOVE_UP: () => dispatch({ type: 'up' }),
    MOVE_DOWN: () => dispatch({ type: 'down' }),
    MOVE_RIGHT: () => dispatch({ type: 'right' }),
    MOVE_LEFT: () => dispatch({ type: 'left' }),
    1: () => dispatch({ type: 'number', value: 1 }),
    2: () => dispatch({ type: 'number', value: 2 }),
    3: () => dispatch({ type: 'number', value: 3 }),
    4: () => dispatch({ type: 'number', value: 4 }),
    5: () => dispatch({ type: 'number', value: 5 }),
    6: () => dispatch({ type: 'number', value: 6 }),
    7: () => dispatch({ type: 'number', value: 7 }),
    8: () => dispatch({ type: 'number', value: 8 }),
    9: () => dispatch({ type: 'number', value: 9 }),
    DEL: () => dispatch({ type: 'number', value: null }),
    CHECK: () => dispatch({ type: 'check' }),
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      <main>
        <h1>Sudoku</h1>
        <div className="controls">
          <p>Difficulté : {difficulty}</p>
          <button onClick={() => dispatch({ type: 'check' })}>✔</button>
        </div>
        <Grid
          values={state.values}
          selectedIndex={state.selectedIndex}
          dispatch={dispatch}
          state={state}
        />
      </main>

      <footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
