const squareIndexes = [0, 3, 6, 27, 30, 33, 54, 57, 60];

export const getSquareIndexes = (squareIndex: number): number[] =>
  [0, 1, 2, 9, 10, 11, 18, 19, 20].map((i) => i + squareIndexes[squareIndex]);

export const getSquareIndex = (caseIndex: number): number => {
  let squareIndex = 0;
  let isCaseInSquare = false;

  while (squareIndex < 9 && !isCaseInSquare) {
    if (getSquareIndexes(squareIndex).includes(caseIndex)) {
      isCaseInSquare = true;
    } else {
      squareIndex += 1;
    }
  }

  return squareIndex;
};

export const getNumbersInSquare = ({
  squareIndex,
  gridValues,
}: {
  squareIndex: number;
  gridValues: number[];
}): number[] =>
  getSquareIndexes(squareIndex)
    .map((caseIndex) => gridValues[caseIndex])
    .filter((v) => v);
