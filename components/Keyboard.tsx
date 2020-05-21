import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import gameSlice, { State } from '../redux/gameSlice';
import { STATUS } from '../utils/constants';

import Timer from './Timer';

const Keyboard = () => {
  const dispatch = useDispatch();
  const [status, elapsedTime] = useSelector((state: State) => [
    state.status,
    state.elapsedTime,
  ]);
  const elapsedTimeCb = (newElapsedTime) =>
    typeof newElapsedTime === 'number'
      ? dispatch(gameSlice.actions.setElapsedTime(newElapsedTime))
      : elapsedTime;

  return (
    <div className="keyboard">
      <div className="numbers">
        {Array.from({ length: 9 })
          .map((_, index) => index + 1)
          .map((v) => (
            <button
              key={v}
              onClick={() => dispatch(gameSlice.actions.fillCase(v))}
            >
              {v}
            </button>
          ))}
      </div>
      <div className="controls">
        <button onClick={() => dispatch(gameSlice.actions.fillCase(null))}>
          🗑
        </button>
        <Timer
          paused={status !== STATUS.PLAYING}
          elapsedTimeCb={elapsedTimeCb}
        />
      </div>
      <style jsx>{`
        .keyboard {
          display: flex;
          flex-direction: row;
        }
        .numbers {
          display: grid;
          grid-template-columns: repeat(3, 40px);
          grid-gap: 0.5rem;
          margin-right: 2rem;
        }
        .controls {
          display: grid;
          grid-template-columns: repeat(1, 40px);
          grid-gap: 0.5rem;
        }
        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        button::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          padding-bottom: calc(100% + 7px);
        }
      `}</style>
    </div>
  );
};

export default Keyboard;
