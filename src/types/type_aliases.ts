/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Type aliases for the module. For interfaces, see ./interfaces.ts.
 */

import type {
  ICliBoolPromptOptions,
  ICliNumericIntegerOptions,
  ICliNumericPromptAsyncTransformOptions,
  ICliNumericPromptAsyncValidationFnOptions,
  ICliNumericPromptRangeOptions,
  ICliNumericPromptSyncTransformOptions,
  ICliNumericPromptSyncValidationFnOptions,
  ICliTextPromptOptions,
  TCliTextPromptAsyncTransformOptions,
  TCliTextPromptAsyncValidationFnOptions,
  TCliTextPromptChoiceOptions,
  TCliTextPromptDefinedDefaultValueOptions,
  TCliTextPromptDefinedRequiredOptions,
  TCliTextPromptRegexValidationOptions,
  TCliTextPromptSyncTransformOptions,
  TCliTextPromptSyncValidationFnOptions,
} from './interfaces.ts';
import { ICliConfirmOptions } from './mod.ts';

type ValidationFn<T extends string | number> = (
  value: T,
) => string | undefined;

type AsyncValidationFn<T extends string | number> = (
  value: T,
) => Promise<string | undefined>;

export type NumericValidationFn = ValidationFn<number>;

export type StringValidationFn = ValidationFn<string>;

export type AsyncNumericValidationFn = AsyncValidationFn<number>;

export type AsyncStringValidationFn = AsyncValidationFn<string>;

type TransformFn<T extends string | number> = (value: T) => T;

type AsyncTransformFn<T extends string | number> = (value: T) => Promise<T>;

export type NumericTransformFn = TransformFn<number>;

export type AsyncNumericTransformFn = AsyncTransformFn<number>;

export type StringTransformFn = TransformFn<string>;

export type AsyncStringTransformFn = AsyncTransformFn<string>;

export type CliTextPromptDefinedOptions<T extends string = string> =
  | TCliTextPromptDefinedDefaultValueOptions<T>
  | TCliTextPromptDefinedRequiredOptions
  | (
    & TCliTextPromptDefinedDefaultValueOptions<T>
    & TCliTextPromptDefinedRequiredOptions
  );

export type CliNumericPromptDefinedOptions =
  | TCliTextPromptDefinedDefaultValueOptions<number>
  | TCliTextPromptDefinedRequiredOptions
  | (
    & TCliTextPromptDefinedDefaultValueOptions<number>
    & TCliTextPromptDefinedRequiredOptions
  );

export type CliBooleanPromptDefinedOptions =
  | TCliTextPromptDefinedDefaultValueOptions<boolean>
  | TCliTextPromptDefinedRequiredOptions
  | (
    & TCliTextPromptDefinedDefaultValueOptions<boolean>
    & TCliTextPromptDefinedRequiredOptions
  );

export type CliTextOptionDefined<T> = [T] extends [CliTextPromptDefinedOptions]
  ? string
  : (string | undefined);

export type CliNumericOptionDefined<T> = [T] extends
  [CliNumericPromptDefinedOptions] ? number : (number | undefined);

export type CliBoolOptionDefined<T> = [T] extends
  [CliBooleanPromptDefinedOptions] ? boolean : (boolean | undefined);

export type CliTextOptions<
  T extends Record<string, string> = Record<string, string>,
  D extends string = Extract<keyof T, string>,
> =
  & (
    | ICliTextPromptOptions
    | TCliTextPromptSyncTransformOptions
    | TCliTextPromptChoiceOptions<T>
    | TCliTextPromptSyncValidationFnOptions
    | TCliTextPromptRegexValidationOptions
    | (
      & TCliTextPromptSyncTransformOptions
      & TCliTextPromptSyncValidationFnOptions
    )
    | (
      & TCliTextPromptSyncTransformOptions
      & TCliTextPromptRegexValidationOptions
    )
    // deno-lint-ignore ban-types
    | (TCliTextPromptSyncTransformOptions & TCliTextPromptChoiceOptions<T>)
  )
  & ({} | CliTextPromptDefinedOptions<D>);

export type CliTextOptionsRequest<
  T extends Record<string, string> = Record<string, string>,
  D extends string = Extract<keyof T, string>,
> = { type: 'text'; name: string } & CliTextOptions<T, D>;

export type AsyncCliTextOptions<
  T extends Record<string, string> = Record<string, string>,
  D extends string = Extract<keyof T, string>,
> =
  & (
    | TCliTextPromptAsyncTransformOptions
    | TCliTextPromptAsyncValidationFnOptions
    | (
      & TCliTextPromptSyncTransformOptions
      & TCliTextPromptAsyncValidationFnOptions
    )
    | (
      & TCliTextPromptAsyncTransformOptions
      & TCliTextPromptSyncValidationFnOptions
    )
    | (
      & TCliTextPromptAsyncTransformOptions
      & TCliTextPromptAsyncValidationFnOptions
    )
    | (
      & TCliTextPromptAsyncTransformOptions
      & TCliTextPromptRegexValidationOptions
    )
    // deno-lint-ignore ban-types
    | (TCliTextPromptAsyncTransformOptions & TCliTextPromptChoiceOptions<T>)
  )
  & ({} | CliTextPromptDefinedOptions<D>);

export type AsyncCliTextOptionsRequest<
  T extends Record<string, string> = Record<string, string>,
  D extends string = Extract<keyof T, string>,
> = { type: 'text-async'; name: string } & AsyncCliTextOptions<T, D>;

export type CliNumericOptions =
  & (
    | ICliNumericIntegerOptions
    | ICliNumericPromptSyncTransformOptions
    | ICliNumericPromptRangeOptions
    | ICliNumericPromptSyncValidationFnOptions
    | (
      & ICliNumericPromptSyncTransformOptions
      & ICliNumericPromptSyncValidationFnOptions
    )
    // deno-lint-ignore ban-types
    | (ICliNumericPromptSyncTransformOptions & ICliNumericPromptRangeOptions)
  )
  & ({} | CliNumericPromptDefinedOptions);

export type CliNumericOptionsRequest =
  & { type: 'numeric'; name: string }
  & CliNumericOptions;

export type AsyncCliNumericOptions =
  & (
    | ICliNumericPromptAsyncTransformOptions
    | ICliNumericPromptAsyncValidationFnOptions
    | (
      & ICliNumericPromptSyncTransformOptions
      & ICliNumericPromptAsyncValidationFnOptions
    )
    | (
      & ICliNumericPromptAsyncTransformOptions
      & ICliNumericPromptSyncValidationFnOptions
    )
    | (
      & ICliNumericPromptAsyncTransformOptions
      & ICliNumericPromptAsyncValidationFnOptions
    )
    | (
      & ICliNumericPromptAsyncTransformOptions
      & ICliNumericPromptRangeOptions
    )
    // deno-lint-ignore ban-types
    | (ICliNumericPromptAsyncTransformOptions & ICliNumericPromptRangeOptions)
  )
  & ({} | CliNumericPromptDefinedOptions);

export type AsyncCliNumericOptionsRequest = {
  type: 'numeric-async';
  name: string;
} & AsyncCliNumericOptions;

export type ParsedCliArgs = {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: (string | number)[];
  '--'?: string[] | undefined;
};

export type CliBoolOptions =
  & ICliBoolPromptOptions
  // deno-lint-ignore ban-types
  & ({} | CliBooleanPromptDefinedOptions);

export type CliBoolOptionsRequest =
  & { type: 'bool'; name: string }
  & CliBoolOptions;

export type CliConfirmOptionsRequest =
  & { type: 'confirm'; name: string }
  & ICliConfirmOptions;

export type CliOptionsRequest<
  T extends Record<string, string> = Record<string, string>,
  D extends string = Extract<keyof T, string>,
> =
  | CliTextOptionsRequest<T, D>
  | AsyncCliTextOptionsRequest<T, D>
  | CliNumericOptionsRequest
  | AsyncCliNumericOptionsRequest
  | CliBoolOptionsRequest
  | CliConfirmOptionsRequest;
