/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Exports the internal constants.
 */

import { CliVerbosity } from '../types/enums.ts';

import type { ParseOptions } from '@std/cli';

export const defaultParseOptions: ParseOptions<undefined, 'verbose'> = {
  string: ['verbose'],
  default: {
    verbose: CliVerbosity.None,
  },
};
