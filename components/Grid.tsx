import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalHotKeys } from 'react-hotkeys';

import Case from './Case';

import { container } from '../theme';
import gameSlice, { State } from '../redux/gameSlice';

const Grid = () => {
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
    SHOW_ONE_CLUE: 'h',
  };

  const dispatch = useDispatch();
  const values = useSelector((state: State) => state.values);

  const handlers = {
    MOVE_UP: () => dispatch(gameSlice.actions.moveUp()),
    MOVE_DOWN: () => dispatch(gameSlice.actions.moveDown()),
    MOVE_RIGHT: () => dispatch(gameSlice.actions.moveRight()),
    MOVE_LEFT: () => dispatch(gameSlice.actions.moveLeft()),
    1: () => dispatch(gameSlice.actions.fillCase(1)),
    2: () => dispatch(gameSlice.actions.fillCase(2)),
    3: () => dispatch(gameSlice.actions.fillCase(3)),
    4: () => dispatch(gameSlice.actions.fillCase(4)),
    5: () => dispatch(gameSlice.actions.fillCase(5)),
    6: () => dispatch(gameSlice.actions.fillCase(6)),
    7: () => dispatch(gameSlice.actions.fillCase(7)),
    8: () => dispatch(gameSlice.actions.fillCase(8)),
    9: () => dispatch(gameSlice.actions.fillCase(9)),
    DEL: () => dispatch(gameSlice.actions.fillCase(null)),
    CHECK: () => dispatch(gameSlice.actions.checkGame()),
    SHOW_ONE_CLUE: () => dispatch(gameSlice.actions.showOneMoreClue()),
  };

  return (
    <div className="grid">
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      {values.map((value, index) => (
        <Case key={index} value={value} index={index} />
      ))}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          width: 100%;
          max-width: ${container.maxWidth};
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Grid;
