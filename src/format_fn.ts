import {
  blue,
  cyan,
  gray,
  green,
  italic,
  red,
  reset,
  yellow,
} from '@std/fmt/colors';
import { CliAllTextTypes, CliFormatFn } from './types/type_aliases.ts';

export const text: Record<CliAllTextTypes, CliFormatFn> = {
  label: (str) => reset(str),
  description: (str) => cyan(str),
  complete: (str) => green(str),
  error: (str) => red(str),
  warning: (str) => yellow(str),
  info: (str) => blue(str),
  success: (str) => green(str),
  debug: (str) => gray(italic(str)),
  trace: (str) => gray(italic(str)),
};
