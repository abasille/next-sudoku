import Head from 'next/head';
import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { DIFFICULTY_OPTIONS, Status } from '../utils/constants';

// import CaseProbabilities from '../components/CaseProbabilities';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import IconClue from '../components/IconClue';
import IconPause from '../components/IconPause';
import IconPlay from '../components/IconPlay';
import IconStop from '../components/IconStop';

import { container } from '../theme';
import gameSlice, { State } from '../redux/gameSlice';

const App = () => {
  const status: Status = useSelector((state: State) => state.status);
  const dispatch = useDispatch();

  return (
    <div className="container">
      <Head>
        <title>Next Sudoku</title>
        <meta
          name="description"
          content="Jouez gratuitement au sudoku sur votre PC ou smartphone. Fonctionne sans accès réseau après installation."
        ></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/static/manifest.json" />
      </Head>

      <header>
        <h1>Sudoku</h1>
        {status === Status.Paused && (
          <div>
            <button
              className="btn-icon"
              onClick={() => dispatch(gameSlice.actions.stopGame())}
              title="Arrêter"
            >
              <IconStop />
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch(gameSlice.actions.playGame())}
              title="Jouer"
            >
              <IconPlay />
            </button>
          </div>
        )}
        {status === Status.Playing && (
          <div className="game-controls">
            <button
              className="btn-icon"
              onClick={() => dispatch(gameSlice.actions.showOneMoreClue())}
              title="Afficher un indice"
            >
              <IconClue />
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch(gameSlice.actions.checkGame())}
              title="Vérifier la grille"
            >
              ✔
            </button>
            <button
              className="btn-icon"
              onClick={() => dispatch(gameSlice.actions.pauseGame())}
              title="Mettre en pause"
            >
              <IconPause />
            </button>
          </div>
        )}
      </header>
      <main>
        {status === Status.Pending && (
          <div className="level-selection">
            <p>Choisissez un niveau de difficulté</p>
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  dispatch(gameSlice.actions.startGame(option.value))
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {status === Status.Playing && (
          <Fragment>
            {/* <div className="controls">
              <p>Difficulté : {state.rate}</p>
            </div> */}
            <Grid />
            {/* <CaseProbabilities state={state} /> */}
            <Keyboard />
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

export default App;
