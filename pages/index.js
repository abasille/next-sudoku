import Head from 'next/head';
import React, { useReducer, Fragment } from 'react';
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

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

        .controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
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
