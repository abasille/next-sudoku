import React, { Fragment } from 'react';
import classnames from 'classnames';

import { ActionType } from '../state';

const Case = ({ value, index, dispatch, state }) => {
  const isSelected = state.selectedIndex === index;
  const onCaseClicked = (index) => {
    dispatch({ type: ActionType.Click, value: index });
  };
  const getSquareIndexes = (offset) =>
    [0, 1, 2, 9, 10, 11, 18, 19, 20].map((i) => i + offset);
  const isOdd = [
    ...getSquareIndexes(0),
    ...getSquareIndexes(6),
    ...getSquareIndexes(30),
    ...getSquareIndexes(54),
    ...getSquareIndexes(60),
  ].includes(index);
  const isError = state.errors.includes(index);
  const isPuzzleValue = state.puzzle[index] !== null;

  return (
    <Fragment>
      <div
        className={classnames('case', {
          'is-selected': isSelected,
          'is-odd': isOdd,
          'is-error': isError,
          'is-puzzle': isPuzzleValue,
        })}
        onClick={() => onCaseClicked(index)}
      >
        {value}
      </div>

      <style jsx>{`
        .case {
          background-color: #e0e0e0;
          border: 1px solid #fff;
          font-size: 1.5rem;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }
        .case::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          padding-bottom: calc(100% - 6px);
        }
        .is-odd {
          background-color: #bed3be;
        }
        .is-selected {
          background-color: #84d483;
        }
        .is-error {
          color: #e00000;
        }
        .is-puzzle {
          font-weight: 600;
        }
      `}</style>
    </Fragment>
  );
};

export default Case;
