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
  const isError = state.gridErrors.includes(index);
  const isProblemValue = state.gridProblem[index] !== null;
  const { isVisible: isVisibleClue } = state.gridPossibilities[index];
  const casePossibilities = state.gridPossibilities[index];

  return (
    <Fragment>
      <div
        className={classnames('case', {
          'is-selected': isSelected,
          'is-odd': isOdd,
          'is-error': isError,
          'is-problem': isProblemValue,
          'is-trivial': isVisibleClue,
          [`is-trivial-${state.gridPossibilities[index].level}`]: isVisibleClue,
        })}
        onClick={() => onCaseClicked(index)}
      >
        <span style={{ color: state.gridColors[index] }}>{value}</span>
        {state.debug.showPossibilities && !isProblemValue && (
          <span className="possibility">
            {casePossibilities.possibleValues.join(' ')}
          </span>
        )}
      </div>

      <style jsx>{`
        .case {
          display: flex;
          position: relative;
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
        .is-problem {
          font-weight: 600;
        }
        .is-trivial {
          border-width: 3px;
          border-style: dotted;
          border-color: green;
        }
        .possibility {
          position: absolute;
          top: 0;
          left: 0;
          color: blue;
          font-size: 0.65rem;
        }
      `}</style>
    </Fragment>
  );
};

export default Case;
