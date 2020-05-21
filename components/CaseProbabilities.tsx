import React from 'react';

import { State } from '../redux/gameSlice';

const CaseProbabilities = ({ state }: { state: State }) => {
  const { selectedIndex, possibleNumbersGrid } = state;

  const {
    possibleValues,
    necessaryValuesFromSquare,
    necessaryValuesFromLine,
    necessaryValuesFromColumn,
  } = possibleNumbersGrid[selectedIndex];

  return (
    <p>
      Possibles :{' '}
      <strong>{possibleValues ? possibleValues.join(', ') : 'N/A'}</strong>
      Square :
      <strong>
        {necessaryValuesFromSquare
          ? necessaryValuesFromSquare.join(', ')
          : 'N/A'}
      </strong>
      Line :
      <strong>
        {necessaryValuesFromLine ? necessaryValuesFromLine.join(', ') : 'N/A'}
      </strong>
      Column :
      <strong>
        {necessaryValuesFromColumn
          ? necessaryValuesFromColumn.join(', ')
          : 'N/A'}
      </strong>
    </p>
  );
};

export default CaseProbabilities;
