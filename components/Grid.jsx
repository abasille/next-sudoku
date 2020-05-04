import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

import Case from './Case';

import { container } from '../theme';
import { ActionType } from '../state';

const Grid = ({ dispatch, state }) => {
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
    MOVE_UP: () => dispatch({ type: ActionType.Up }),
    MOVE_DOWN: () => dispatch({ type: ActionType.Down }),
    MOVE_RIGHT: () => dispatch({ type: ActionType.Right }),
    MOVE_LEFT: () => dispatch({ type: ActionType.Left }),
    1: () => dispatch({ type: ActionType.Number, value: 1 }),
    2: () => dispatch({ type: ActionType.Number, value: 2 }),
    3: () => dispatch({ type: ActionType.Number, value: 3 }),
    4: () => dispatch({ type: ActionType.Number, value: 4 }),
    5: () => dispatch({ type: ActionType.Number, value: 5 }),
    6: () => dispatch({ type: ActionType.Number, value: 6 }),
    7: () => dispatch({ type: ActionType.Number, value: 7 }),
    8: () => dispatch({ type: ActionType.Number, value: 8 }),
    9: () => dispatch({ type: ActionType.Number, value: 9 }),
    DEL: () => dispatch({ type: ActionType.Number, value: null }),
    CHECK: () => dispatch({ type: ActionType.Check }),
  };

  return (
    <div className="grid">
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      {state.values.map((value, index) => (
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
