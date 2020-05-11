import { buildSuite } from '../utils/generator';

export const getColumnIndexes = (columnIndex: number): number[] =>
  buildSuite().map((v) => (v - 1) * 9 + columnIndex);

export const getColumnIndex = (caseIndex: number): number => caseIndex % 9;

export const getNumbersInColumn = ({
  columnIndex,
  gridValues,
}: {
  columnIndex: number;
  gridValues: number[];
}): number[] =>
  getColumnIndexes(columnIndex)
    .map((caseIndex) => gridValues[caseIndex])
    .filter((v) => v);
