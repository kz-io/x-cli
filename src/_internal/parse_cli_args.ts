/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Exports the internal parseCliArgs function.
 */

import { parseArgs, type ParseOptions } from '@std/cli';
import { defaultParseOptions } from './constants.ts';
import { CliVerbosity } from '../types/enums.ts';

import type { ICliOptions, ParsedCliArgs } from '../types/mod.ts';

function parseVerbosity(level?: number): CliVerbosity {
  const parsedLevel = +(level === undefined ? CliVerbosity.None : level);
  const correctedLevel = parsedLevel < CliVerbosity.All
    ? CliVerbosity.All
    : parsedLevel > CliVerbosity.None
    ? CliVerbosity.None
    : parsedLevel;

  return correctedLevel;
}

function extractCliArgs(args: ParsedCliArgs): ParsedCliArgs {
  const cliArgs: Record<string, unknown> = {};

  for (const key in args) {
    if (!['verbose'].includes(key)) {
      cliArgs[key] = args[key];
    }
  }

  return cliArgs as ParsedCliArgs;
}

function parseCliOptions(args: ParsedCliArgs): ICliOptions {
  const verbosity = parseVerbosity(args['verbose']);
  const lang = args['lang'] || 'en';

  const options = { verbosity, lang };

  return options;
}

export function parseCliArgs(
  args: string[],
  parseOptions: ParseOptions = {},
): ICliOptions & { args: ParsedCliArgs } {
  const parsedArgs = parseArgs(
    args,
    { ...parseOptions, ...defaultParseOptions } as ParseOptions,
  );
  const options = parseCliOptions(parsedArgs);
  const cliArgs = extractCliArgs(parsedArgs);
  const combined = { ...options, args: cliArgs };

  return combined;
}
