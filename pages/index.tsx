import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { DIFFICULTY_OPTIONS, Status, Difficulty } from '../utils/constants';

import AppContainer from '../components/AppContainer';
import AppHeader from '../components/AppHeader';
import AppMain from '../components/AppMain';

import gameSlice, { State } from '../redux/gameSlice';

// TODO Annulation des derniers coups
// TODO Amélioration des niveaux de difficulté
// TODO Plusieurs couleurs pour les cas où plusieurs alternatives possible (afin de pouvoir les retrouver)
// TODO Stocker le state dans localStorage (redux-persist) + gestion des évolutions de format
const Index = () => {
  const status: Status = useSelector((state: State) => state.status);
  const dispatch = useDispatch();
  const router = useRouter();

  const onLevelClicked = (difficulty: Difficulty) => {
    dispatch(gameSlice.actions.startGame(difficulty));
    router.push('/game');
  };

  return (
    <AppContainer>
      <AppHeader />
      <AppMain>
        {status === Status.Pending && (
          <div className="level-selection">
            <p>Choisissez un niveau de difficulté</p>
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onLevelClicked(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </AppMain>

      <style jsx>{`
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
      `}</style>
    </AppContainer>
  );
};

export default Index;
