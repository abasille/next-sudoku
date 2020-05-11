import { buildSuite } from '../utils/generator';

export const getLineIndexes = (lineIndex: number): number[] =>
  buildSuite().map((v) => lineIndex * 9 + v - 1);

export const getLineIndex = (caseIndex: number): number =>
  Math.floor(caseIndex / 9);

export const getNumbersInLine = ({
  lineIndex,
  gridValues,
}: {
  lineIndex: number;
  gridValues: number[];
}): number[] =>
  getLineIndexes(lineIndex)
    .map((caseIndex) => gridValues[caseIndex])
    .filter((v) => v);
