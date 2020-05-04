import Head from 'next/head';
import React, { useReducer, Fragment } from 'react';

import { DIFFICULTY_OPTIONS, STATUS } from '../utils/constants';

import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import Timer from '../components/Timer';
import IconPause from '../components/IconPause';
import IconPlay from '../components/IconPlay';
import IconStop from '../components/IconStop';

import { container } from '../theme';
import { reducer, ActionType } from '../state';

// TODO Sauvegarder la partie
const Home = () => {
  const initialState = {
    selectedIndex: undefined,
    // values: matrix.reduce((values, row) => [...values, ...row], []),
    puzzle: [],
    values: [],
    solution: [],
    rate: undefined,
    errors: [],
    status: STATUS.PENDING,
    elapsedTime: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const elapsedTimeCb = (elapsedTime) =>
    typeof elapsedTime === 'number'
      ? dispatch({ type: ActionType.SetElapsedTime, value: elapsedTime })
      : state.elapsedTime;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>Sudoku</h1>
        {state.status === STATUS.PLAYING && (
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: ActionType.Stop })}
            title="Arrêter"
          >
            <IconStop />
          </button>
        )}
        {[STATUS.PAUSED, STATUS.PLAYING].includes(state.status) && (
          <Timer
            paused={state.status !== STATUS.PLAYING}
            elapsedTimeCb={elapsedTimeCb}
          />
        )}
        {state.status === STATUS.PAUSED && (
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: ActionType.Play })}
            title="Jouer"
          >
            <IconPlay />
          </button>
        )}
        {state.status === STATUS.PLAYING && (
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: ActionType.Pause })}
            title="Mettre en pause"
          >
            <IconPause />
          </button>
        )}
      </header>
      <main>
        {state.status === STATUS.PENDING && (
          <Fragment>
            <p>Choisissez un niveau de difficulté</p>
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  dispatch({ type: ActionType.Start, value: option.value })
                }
              >
                {option.label}
              </button>
            ))}
          </Fragment>
        )}
        {state.status === STATUS.PLAYING && (
          <Fragment>
            <div className="controls">
              <p>Difficulté : {state.rate}</p>
              <button
                className="btn-icon"
                onClick={() => dispatch({ type: ActionType.Check })}
                title="Vérifier la grille"
              >
                ✔
              </button>
            </div>
            <Grid dispatch={dispatch} state={state} />
            <Keyboard dispatch={dispatch} />
          </Fragment>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          margin: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          max-width: ${container.maxWidth};
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
