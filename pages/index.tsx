import React from 'react';

import App from '../components/App';

// TODO Séparer pages : home, game
// TODO Annulation de l'historique
// TODO Meilleure gestion des niveaux de difficulté
// TODO Plusieurs couleurs pour les cas où plusieurs alternatives possible (afin de pouvoir les retrouver)
// TODO Stocker le state dans localStorage (redux-persist) + gestion des évolutions de format
const Index = () => {
  // const stateFromLocalStorage =
  //   typeof window === 'object'
  //     ? window.localStorage.getItem('state')
  //     : undefined;
  // const stateFromLocalStorageObject = stateFromLocalStorage
  //   ? JSON.parse(stateFromLocalStorage)
  //   : undefined;
  // const initialState = stateFromLocalStorageObject || initialStateDefault;

  return <App />;
};

export default Index;
