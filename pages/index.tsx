import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import App from '../components/App';

import gameSlice from '../redux/gameSlice';

const store = configureStore({ reducer: gameSlice.reducer });

// TODO Meilleure gestion des niveaux de difficulté
// TODO Plusieurs couleurs pour les cas où plusieurs alternatives possible (afin de pouvoir les retrouver)
// TODO Améliorer robustesse du localStorage en cas d'évolution + Ne stocker que le necéssaire
const Index = () => {
  // const stateFromLocalStorage =
  //   typeof window === 'object'
  //     ? window.localStorage.getItem('state')
  //     : undefined;
  // const stateFromLocalStorageObject = stateFromLocalStorage
  //   ? JSON.parse(stateFromLocalStorage)
  //   : undefined;
  // const initialState = stateFromLocalStorageObject || initialStateDefault;

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Index;
