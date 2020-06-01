import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { Status, Difficulty, DIFFICULTY_OPTIONS } from '../utils/constants';

import AppContainer from '../components/AppContainer';
import AppHeader from '../components/AppHeader';
import AppMain from '../components/AppMain';

import gameSlice, { State } from '../redux/gameSlice';

const App = () => {
  const [status, difficulty]: [
    Status,
    Difficulty
  ] = useSelector((state: State) => [state.status, state.difficulty]);
  const dispatch = useDispatch();
  const router = useRouter();

  const onStartGameClicked = () => {
    dispatch(gameSlice.actions.stopGame());
    router.push('/');
  };

  if (status !== Status.Completed) {
    router.push('/');
  }

  return (
    <AppContainer>
      <AppHeader />
      <AppMain>
        {status === Status.Completed && (
          <div className="completed">
            <h2>Bravo!</h2>
            <p>
              Vous avez terminé avec brio ce sudoku de niveau{' '}
              <strong>
                {DIFFICULTY_OPTIONS.find((o) => o.value === difficulty).label}
              </strong>
              .
            </p>
            <button onClick={() => onStartGameClicked()}>
              Commencer une nouvelle partie
            </button>
          </div>
        )}
      </AppMain>

      <style jsx>{`
        button {
          height: 2rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </AppContainer>
  );
};

export default App;
