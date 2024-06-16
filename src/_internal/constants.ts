import { CliAllTextTypes, CliVerbosityLevel } from '../types/type_aliases.ts';

export const verbosityIndex = [
  'all',
  'trace',
  'debug',
  'info',
  'warning',
  'error',
  'none',
] as const;

export const textTypeVerbosityMap = new Map<CliAllTextTypes, CliVerbosityLevel>([
  ['label', 'none'],
  ['description', 'none'],
  ['complete', 'none'],
  ['error', 'error'],
  ['warning', 'warning'],
  ['info', 'info'],
  ['success', 'info'],
  ['debug', 'debug'],
  ['trace', 'trace'],
]);
