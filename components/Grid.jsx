import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

import Case from './Case';

import { container } from '../theme';

const Grid = ({ values, dispatch, state }) => {
  // Shortkeys
  const keyMap = {
    MOVE_UP: 'up',
    MOVE_DOWN: 'down',
    MOVE_RIGHT: 'right',
    MOVE_LEFT: 'left',
    DEL: 'DEL',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    CHECK: 'v',
  };

  const handlers = {
    MOVE_UP: () => dispatch({ type: 'up' }),
    MOVE_DOWN: () => dispatch({ type: 'down' }),
    MOVE_RIGHT: () => dispatch({ type: 'right' }),
    MOVE_LEFT: () => dispatch({ type: 'left' }),
    1: () => dispatch({ type: 'number', value: 1 }),
    2: () => dispatch({ type: 'number', value: 2 }),
    3: () => dispatch({ type: 'number', value: 3 }),
    4: () => dispatch({ type: 'number', value: 4 }),
    5: () => dispatch({ type: 'number', value: 5 }),
    6: () => dispatch({ type: 'number', value: 6 }),
    7: () => dispatch({ type: 'number', value: 7 }),
    8: () => dispatch({ type: 'number', value: 8 }),
    9: () => dispatch({ type: 'number', value: 9 }),
    DEL: () => dispatch({ type: 'number', value: null }),
    CHECK: () => dispatch({ type: 'check' }),
  };

  return (
    <div className="grid">
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      {values.map((value, index) => (
        <Case
          key={index}
          value={value}
          index={index}
          dispatch={dispatch}
          state={state}
        />
      ))}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          width: 100%;
          max-width: ${container.maxWidth};
        }
      `}</style>
    </div>
  );
};

export default Grid;
