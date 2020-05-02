import Head from 'next/head';
import React, { useReducer, Fragment } from 'react';
import sudoku from 'sudoku';

import { STATUS } from '../utils/constants';

import Grid from '../components/Grid';
import Timer from '../components/Timer';
import IconPause from '../components/IconPause';
import IconPlay from '../components/IconPlay';

const puzzle = sudoku.makepuzzle();
const solution = sudoku.solvepuzzle(puzzle);
const difficulty = sudoku.ratepuzzle(puzzle, 4);

// TODO Sauvegarder la partie
const Home = () => {
  const initialState = {
    selectedIndex: undefined,
    // values: matrix.reduce((values, row) => [...values, ...row], []),
    puzzle: puzzle.map((v) => (v !== null ? v + 1 : null)),
    values: puzzle.map((v) => (v !== null ? v + 1 : null)),
    solution: solution.map((v) => v + 1),
    difficulty,
    errors: [],
    status: STATUS.PENDING,
    elapsedTime: 0,
  };

  // State machine
  const reducer = (state, action) => {
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
      case 'play':
        return {
          ...state,
          status: STATUS.PLAYING,
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
            if (
              state.values[index] !== null &&
              state.values[index] !== solValue
            )
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

  const [state, dispatch] = useReducer(reducer, initialState);

  const elapsedTimeCb = (elapsedTime) =>
    typeof elapsedTime === 'number'
      ? dispatch({ type: 'setElapsedTime', value: elapsedTime })
      : state.elapsedTime;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>Sudoku</h1>
        <Timer
          paused={state.status !== STATUS.PLAYING}
          elapsedTimeCb={elapsedTimeCb}
        />
        {[STATUS.PENDING, STATUS.PAUSED].includes(state.status) && (
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: 'play' })}
            title="Jouer"
          >
            <IconPlay />
          </button>
        )}
        {state.status === STATUS.PLAYING && (
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: 'pause' })}
            title="Mettre en pause"
          >
            <IconPause />
          </button>
        )}
      </header>
      <main>
        {state.status === STATUS.PLAYING && (
          <Fragment>
            <div className="controls">
              <p>Difficulté : {difficulty}</p>
              <button
                className="btn-icon"
                onClick={() => dispatch({ type: 'check' })}
                title="Vérifier la grille"
              >
                ✔
              </button>
            </div>
            <Grid values={state.values} dispatch={dispatch} state={state} />
          </Fragment>
        )}
      </main>

      <footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        h1 {
          margin-block-start: 0;
          margin-block-end: 0;
        }

        main {
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .btn-icon {
          width: 2rem;
          height: 2rem;
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
          font-size: 16px;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
