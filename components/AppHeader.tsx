import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import IconClue from './IconClue';
import IconPause from './IconPause';
import IconPlay from './IconPlay';
import IconStop from './IconStop';
import { Status } from '../utils/constants';
import gameSlice, { State, GridHistoryItem } from '../redux/gameSlice';

const Header = () => {
  const [status, gridHistory]: [
    Status,
    GridHistoryItem[]
  ] = useSelector((state: State) => [state.status, state.gridHistory]);
  const dispatch = useDispatch();
  const router = useRouter();

  const onStopClicked = () => {
    dispatch(gameSlice.actions.stopGame());
    router.push('/');
  };

  return (
    <header>
      <h1>Sudoku</h1>
      {status === Status.Paused && (
        <div>
          <button className="btn-icon" onClick={onStopClicked} title="Arrêter">
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
            onClick={() => dispatch(gameSlice.actions.undoFillCase())}
            title="Annuler le dernier coup"
            disabled={gridHistory.length === 0}
          >
            ↶
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
      <style jsx>{`
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
    </header>
  );
};

export default Header;
