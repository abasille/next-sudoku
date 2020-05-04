import React from 'react';

import { ActionType } from '../state';

const Keyboard = ({ dispatch }) => {
  return (
    <div className="keyboard">
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
      <button
        onClick={() => dispatch({ type: ActionType.Number, value: null })}
      >
        🗑
      </button>
      <style jsx>{`
        .keyboard {
          display: grid;
          grid-template-columns: repeat(3, 40px);
          grid-gap: 0.5rem;
          margin-top: 0.5rem;
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
