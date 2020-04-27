import React, { Fragment } from 'react';
import classnames from 'classnames';

export const Case = ({ value, index, selectedIndex, dispatch, state }) => {
  const isSelected = selectedIndex === index;
  const onCaseClicked = (index) => {
    dispatch({ type: 'click', value: index });
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
          padding: 20px;
          font-size: 30px;
          text-align: center;
          cursor: pointer;
          user-select: none;
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
