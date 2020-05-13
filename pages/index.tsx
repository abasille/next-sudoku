import Head from 'next/head';
import React, { useReducer, Fragment } from 'react';

import { DIFFICULTY_OPTIONS, STATUS } from '../utils/constants';

import CaseProbabilities from '../components/CaseProbabilities';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import IconClue from '../components/IconClue';
import IconPause from '../components/IconPause';
import IconPlay from '../components/IconPlay';
import IconStop from '../components/IconStop';

import { container } from '../theme';
import { reducer, ActionType } from '../state';

// TODO Meilleure gestion des niveaux de difficulté
// TODO Plusieurs couleurs pour les cas où plusieurs alternatives possible (afin de pouvoir les retrouver)
// TODO Améliorer robustesse du localStorage en cas d'évolution + Ne stocker que le necéssaire
const Home = () => {
  const stateFromLocalStorage =
    typeof window === 'object'
      ? window.localStorage.getItem('state')
      : undefined;

  const stateFromLocalStorageObject = stateFromLocalStorage
    ? JSON.parse(stateFromLocalStorage)
    : undefined;

  const initialState = stateFromLocalStorageObject || {
    selectedIndex: undefined,
    puzzle: [],
    values: [],
    solution: [],
    possibleNumbersGrid: undefined,
    rate: undefined,
    errors: [],
    status: STATUS.PENDING,
    elapsedTime: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>Sudoku</h1>
        {state.status === STATUS.PAUSED && (
          <div>
            <button
              className="btn-icon"
              onClick={() => dispatch({ type: ActionType.Stop })}
              title="Arrêter"
            >
              <IconStop />
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch({ type: ActionType.Play })}
              title="Jouer"
            >
              <IconPlay />
            </button>
          </div>
        )}
        {state.status === STATUS.PLAYING && (
          <div className="game-controls">
            <button
              className="btn-icon"
              onClick={() => dispatch({ type: ActionType.ShowOneMoreClue })}
              title="Afficher un indice"
            >
              <IconClue />
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch({ type: ActionType.Check })}
              title="Vérifier la grille"
            >
              ✔
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch({ type: ActionType.Pause })}
              title="Mettre en pause"
            >
              <IconPause />
            </button>
          </div>
        )}
      </header>
      <main>
        {state.status === STATUS.PENDING && (
          <div className="level-selection">
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
          </div>
        )}
        {state.status === STATUS.PLAYING && (
          <Fragment>
            {/* <div className="controls">
              <p>Difficulté : {state.rate}</p>
            </div> */}
            <Grid dispatch={dispatch} state={state} />
            {/* <CaseProbabilities state={state} /> */}
            <Keyboard state={state} dispatch={dispatch} />
          </Fragment>
        )}
      </main>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          min-height: 100vh;
          max-width: ${container.maxWidth};
        }

        header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.25rem 0.5rem;
          color: #ffffff;
          background-color: #9bbc9a;
        }

        h1 {
          margin-block-start: 0;
          margin-block-end: 0;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          flex: 1;
          padding: 0 0.5rem;
          width: 100%;
        }

        .level-selection {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }

        .level-selection button {
          height: 2rem;
          margin-bottom: 0.5rem;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .game-controls {
          display: flex;
        }

        .btn-icon {
          width: 2rem;
          height: 2rem;
        }
        .btn-icon:not(:last-child) {
          margin-right: 1rem;
        }
      `}</style>

      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          font-family: Helvetica Neue, sans-serif;
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
