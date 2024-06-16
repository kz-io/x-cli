import { type ParseOptions } from '@std/cli';

import type {
  CliDebugTextTypes,
  CliStateTextTypes,
  CliStringGeneratorFn,
  CliTextAcknowledgementFn,
  CliTextTypes,
  CliAllTextTypes,
  CliWhenFn,
  CliPrompts,
} from './type_aliases.ts';

/**
 * The arguments passed to functions in the CLI.
 */
export interface TCliFnArgs<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * The arguments currently consumed by the CLI.
   */
  args: Partial<T>;
}

/**
 * The base interface for all CLI text outputs.
 *
 * Debug messages are displayed based on verbosity level.
 *
 * @example
 * ```ts
 * import {TCliTextBasePrompt} from './interfaces.ts';
 *
 * const prompt: TCliTextBasePrompt = {
 *   type: 'text',
 *   message: 'Welcome to the CLI!',
 * };
 *
 * const debug: TCliTextBasePrompt = {
 *   type: 'debug',
 *   message: 'Debugging the CLI...',
 * };
 * ```
 */
export interface TCliTextBasePrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
  K extends CliAllTextTypes = CliTextTypes | CliDebugTextTypes,
> {
  /**
   * The type of text to display.
   */
  type: K;

  /**
   * The message to display.
   */
  message: string | CliStringGeneratorFn<T>;
}

/**
 * A text message that is displayed based on the verbosity level.
 *
 * Messages are displayed based on the following priority:
 * - `required: true`
 * - `when => true`
 * - verbosity level
 *
 * @example
 * ```ts
 * import {TCliStateTextPrompt} from './interfaces.ts';
 *
 * const warning: TCliStateTextPrompt = {
 *   type: 'warning',
 *   message: 'Warning: This is a warning message!',
 *   required: true,
 * };
 *
 * const info: TCliStateTextPrompt = {
 *   type: 'info',
 *   message: 'Info: This is an info message!',
 *   when: ({args}) => args.name === 'John',
 * };
 * ```
 */
export interface TCliStateTextPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliTextBasePrompt<T, CliStateTextTypes> {
  /**
   * Conditionally display the message. Overrides verbosity level.
   */
  when?: CliWhenFn<T>;

  /**
   * Whether the message is required to be displayed. Overrides `when` and verbosity level.
   */
  required?: boolean;
}

/**
 * A text message that requires acknowledgement.
 *
 * Messages are displayed based on the following priority:
 * - `acknowledge: true`
 * - `required: true`
 * - `when => true`
 * - verbosity level
 *
 * @example
 * ```ts
 * import {TAcknowledgebleText} from './interfaces.ts';
 *
 * const acknowledge: TAcknowledgebleText = {
 *   type: 'info',
 *   message: 'Please acknowledge this message.',
 *   acknowledge: true,
 *   onAcknowledgement: ({args}) => console.log('Acknowledged!'),
 * };
 * ```
 */
export interface TAcknowledgeableTextPrompt<
  T extends Record<string, unknown> = Record<string, unknown>
> extends TCliStateTextPrompt<T> {
  /**
   * Whether the message requires acknowledgement. Overrides `required`, `when`, and verbosity level.
   */
  acknowledge: boolean;

  /**
   * The function to call when the message is acknowledged.
   */
  onAcknowledgement?: CliTextAcknowledgementFn<T>;
}

/**
 * A prompt that diverges into branches depending on a selection.
 * 
 * @example
 * ```ts
 * import {TCliDivergencePrompt} from './interfaces.ts';
 * 
 * const prompt: TCliDivergencePrompt = {
 *   type: 'divergence',
 *   select: ({args}) => args.branch,
 *   branches: {
 *     branch1: [
 *       {
 *         type: 'description',
 *         message: 'Branch 1 selected!',
 *       }
 *     ],
 *     branch2: [
 *       {
 *         type: 'description',
 *         message: 'Branch 2 selected!',
 *       }
 *     ],
 *   },
 * };
 * ```
 */
export interface TCliDivergencePrompt<
T extends Record<string, unknown> = Record<string, unknown>,
K extends string = string,
> {
  /**
   * The type of prompt.
   */
  type: 'divergence';

  /**
   * The function to select a branch.
   * 
   * @param args The arguments passed to the selector.
   * @returns The key of the branch to select.
   */
  select: (args: TCliFnArgs<T>) => K | Promise<K>;

  /**
   * The branches to diverge into.
   */
  branches: {
    /**
     * The key of the branch.
     */
    [P in K]: CliPrompts<T>[];
  };
}

/**
 * A base prompt for all CLI input prompts.
 */
export interface TCliInputBasePrompt<
T extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * The CLI key of the prompt.
   */
  name: keyof T;

  /**
   * The message to display.
   */
  message: string | CliStringGeneratorFn<T>;

  /**
   * Whether to force the request if provided via CLI argument.
   */
  force?: boolean;
}

/**
 * A prompt that requests a confirmation.
 */
export interface TCliInputConfirmPrompt<
T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputBasePrompt<T> {
  /**
   * The type of prompt.
   */
  type: 'confirm';
}

/**
 * Common prompt properties for text, number, and yesno prompts.
 */
export interface ICliInputCommonPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
  V extends string | number | boolean = string,
> extends TCliInputBasePrompt<T> {
  /**
   * The help text to display.
   */
  helpText?: string | CliStringGeneratorFn<T>;

  /**
   * The default value for the prompt.
   */
  defaultValue?: V;

  /**
   * Whether the prompt is required. This is not the same as force.
   */
  required?: boolean;
}

/**
 * Prompts that support transforms of the input value.
 */
export interface TCliInputTransformPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
  V extends string | number = string,
> extends ICliInputCommonPrompt<T> {
  /**
   * The function to transform the input value.
   * 
   * @param value The input value.
   * @returns The transformed value.
   */
  transform?: (value: V) => V | Promise<V>;
}

/**
 * A prompt that requests text input.
 */
export interface TCliInputTextPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputTransformPrompt<T, string> {
  /**
   * The type of prompt.
   */
  type: 'text';
}

/**
 * A prompt that validates text input.
 */
export interface TCliInputTextValidatePrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputTextPrompt<T> {
  /**
   * The regular expression or function to validate the input.
   */
  validate: RegExp | ((value: string) => string | undefined | Promise<string | undefined>);
}

/**
 * A prompt that requests text input with choices.
 */
export interface TCliInputTextChoicesPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputTextPrompt<T> {
  /**
   * The choices for the input.
   */
  choices: Record<string, string>;
}

/**
 * A prompt that requests a number input.
 */
export interface TCliInputNumberPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputTransformPrompt<T, number> {
  /**
   * The type of prompt.
   */
  type: 'number';
  /**
   * Whether the inpout should be an integer.
   */
  integer?: boolean;
}

/**
 * A prompt that validates number input.
 */
export interface TCliInputNumberValidatePrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputNumberPrompt<T> {
  /**
   * The function to validate the input.
   */
  validate: (value: number) => number | undefined | Promise<number | undefined>;
}

/**
 * A prompt that requests a number within a range.
 */
export interface TCliInputNumberRangePrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends TCliInputNumberPrompt<T> {
  /**
   * The minimum value for the input.
   */
  min: number;

  /**
   * The maximum value for the input.
   */
  max: number;
}

/**
 * A prompt that requests a yes or no input.
 */
export interface TCliInputYesNoPrompt<
T extends Record<string, unknown> = Record<string, unknown>,
> extends ICliInputCommonPrompt<T, boolean> {
  /**
   * The type of prompt.
   */
  type: 'yesno';
}

/**
 * The options passed to the CLI.
 */
export interface ICliOptions {
  /**
   * The arguments passed to the CLI.
   */
  args: string[];

  /**
   * The banner to display at the top of the CLI.
   */
  banner: string;

  /**
   * The name of the CLI.
   */
  name: string;

  /**
   * The description of the CLI.
   */
  description: string;

  /**
   * The version of the CLI.
   */
  version: string;

  /**
   * The URL to the CLI's help.
   */
  url: string;

  /**
   * The options to parse to the Deno `parseArgs` function.
   */
  parseOptions: ParseOptions;
}
