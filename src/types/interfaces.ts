/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Interfaces for the module. For type aliases, see ./type_aliases.ts.
 */

import { ParseOptions } from '@std/cli';

import { CliVerbosity } from './enums.ts';
import type {
  AsyncNumericTransformFn,
  AsyncNumericValidationFn,
  AsyncStringTransformFn,
  AsyncStringValidationFn,
  NumericTransformFn,
  NumericValidationFn,
  StringTransformFn,
  StringValidationFn,
} from './type_aliases.ts';

export interface ICliConfig {
  banner: string;
  color: number;
  displayName: string;
  separator: string;
  args: string[];
  parseOptions: ParseOptions;
}

export interface TLanguageSpec<T> {
  lang: string;
  strings: T;
}

export interface ICliOptions {
  verbosity: CliVerbosity;
  lang: string;
}

export interface ICliConfirmOptions {
  message: string;
}

export interface ICliTextPromptOptions {
  message: string;
  helpText?: string;
}

export interface TCliTextPromptDefinedDefaultValueOptions<
  T extends string | number | boolean = string,
> extends ICliTextPromptOptions {
  defaultValue: T;
}

export interface TCliTextPromptDefinedRequiredOptions
  extends ICliTextPromptOptions {
  required: true;
}

export interface TCliTextPromptChoiceOptions<
  T extends Record<string, string> = Record<string, string>,
> extends ICliTextPromptOptions {
  choices: T;
}

export interface TCliTextPromptSyncTransformOptions
  extends ICliTextPromptOptions {
  transformFn: StringTransformFn;
}

export interface TCliTextPromptAsyncTransformOptions
  extends ICliTextPromptOptions {
  transformFn: AsyncStringTransformFn;
}

export interface TCliTextPromptSyncValidationFnOptions
  extends ICliTextPromptOptions {
  validationFn: StringValidationFn;
}

export interface TCliTextPromptAsyncValidationFnOptions
  extends ICliTextPromptOptions {
  validationFn: AsyncStringValidationFn;
}

export interface TCliTextPromptRegexValidationOptions
  extends ICliTextPromptOptions {
  validationRegex: RegExp;
  format: string;
}

export interface ICliNumericIntegerOptions extends ICliTextPromptOptions {
  integer?: boolean;
}

export interface ICliNumericPromptRangeOptions
  extends ICliNumericIntegerOptions {
  min: number;
  max: number;
}

export interface ICliNumericPromptSyncTransformOptions
  extends ICliNumericIntegerOptions {
  transformFn: NumericTransformFn;
}

export interface ICliNumericPromptAsyncTransformOptions
  extends ICliNumericIntegerOptions {
  transformFn: AsyncNumericTransformFn;
}

export interface ICliNumericPromptSyncValidationFnOptions
  extends ICliNumericIntegerOptions {
  validationFn: NumericValidationFn;
}

export interface ICliNumericPromptAsyncValidationFnOptions
  extends ICliNumericIntegerOptions {
  validationFn: AsyncNumericValidationFn;
}

export interface ICliBoolPromptOptions extends ICliTextPromptOptions {
  negate?: boolean;
}
