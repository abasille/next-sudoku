import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import gameSlice, { State } from '../redux/gameSlice';

const Case = ({ value, index }: { value?: number; index: number }) => {
  const dispatch = useDispatch();
  const state: State = useSelector((state: State) => state);
  const isSelected = state.selectedIndex === index;
  const onCaseClicked = (index: number) => {
    dispatch(gameSlice.actions.clickCase(index));
  };
  const getSquareIndexes = (offset: number) =>
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
  const { isVisible: isVisibleClue } = state.possibleNumbersGrid[index];

  return (
    <Fragment>
      <div
        className={classnames('case', {
          'is-selected': isSelected,
          'is-odd': isOdd,
          'is-error': isError,
          'is-puzzle': isPuzzleValue,
          'is-trivial': isVisibleClue,
          [`is-trivial-${state.possibleNumbersGrid[index].level}`]: isVisibleClue,
        })}
        onClick={() => onCaseClicked(index)}
      >
        {value}
      </div>

      <style jsx>{`
        .case {
          display: flex;
          box-sizing: border-box;
          height: 100%;
          justify-content: center;
          align-items: center;
          background-color: #e0e0e0;
          border: 1px solid #fff;
          font-size: 1.5rem;
          cursor: pointer;
          user-select: none;
        }
        .case::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          padding-bottom: 100%;
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
        .is-trivial {
          border-width: 3px;
          border-style: dotted;
          border-color: green;
        }
      `}</style>
    </Fragment>
  );
};

export default Case;
