import React from 'react';

import { Case } from './case';

export const Grid = ({ values, selectedIndex, dispatch, state }) => {
  return (
    <div className="grid">
      {values.map((value, index) => (
        <Case
          key={index}
          value={value}
          index={index}
          dispatch={dispatch}
          selectedIndex={selectedIndex}
          state={state}
        />
      ))}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(9, 70px);
          grid-template-rows: repeat(9, 70px);
          padding: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
