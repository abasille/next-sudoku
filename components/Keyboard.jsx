import React from 'react';

import { ActionType } from '../state';
import { STATUS } from '../utils/constants';

import Timer from '../components/Timer';

const Keyboard = ({ state, dispatch }) => {
  const elapsedTimeCb = (elapsedTime) =>
    typeof elapsedTime === 'number'
      ? dispatch({ type: ActionType.SetElapsedTime, value: elapsedTime })
      : state.elapsedTime;

  return (
    <div className="keyboard">
      <div className="numbers">
        {Array.from({ length: 9 })
          .map((_, index) => index + 1)
          .map((v) => (
            <button
              key={v}
              onClick={() => dispatch({ type: ActionType.Number, value: v })}
            >
              {v}
            </button>
          ))}
      </div>
      <div className="controls">
        <button
          onClick={() => dispatch({ type: ActionType.Number, value: null })}
        >
          🗑
        </button>
        <Timer
          paused={state.status !== STATUS.PLAYING}
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
