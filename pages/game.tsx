import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../utils/constants';

import AppContainer from '../components/AppContainer';
import AppHeader from '../components/AppHeader';
import AppMain from '../components/AppMain';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';

import { State } from '../redux/gameSlice';

const App = () => {
  const status: Status = useSelector((state: State) => state.status);

  return (
    <AppContainer>
      <AppHeader />
      <AppMain>
        {status === Status.Playing && (
          <Fragment>
            <Grid />
            <Keyboard />
          </Fragment>
        )}
      </AppMain>

      <style jsx>{``}</style>
    </AppContainer>
  );
};

export default App;
