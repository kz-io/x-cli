import {
  TAcknowledgeableTextPrompt,
  TCliFnArgs,
  TCliStateTextPrompt,
  TCliTextBasePrompt,
  TCliDivergencePrompt,
  TCliInputYesNoPrompt,
  TCliInputConfirmPrompt,
  TCliInputTextPrompt,
  TCliInputTextValidatePrompt,
  TCliInputTextChoicesPrompt,
  TCliInputNumberPrompt,
  TCliInputNumberRangePrompt,
  TCliInputNumberValidatePrompt,
} from './interfaces.ts';

/**
 * The types of text that can be displayed in the CLI regardless of verbosity level.
 */
export type CliTextTypes = 'label' | 'description' | 'complete';

/**
 * The types of stateful text that can be displayed in the CLI based on verbosity level.
 */
export type CliStateTextTypes = 'error' | 'warning' | 'info' | 'success';

/**
 * The types of debug text that can be displayed in the CLI based on verbosity level.
 */
export type CliDebugTextTypes = 'debug' | 'trace';

/**
 * All types of text that can be displayed in the CLI.
 
 */
export type CliAllTextTypes =
  | CliTextTypes
  | CliStateTextTypes
  | CliDebugTextTypes;

/**
 * The verbosity levels of the CLI.
 */
export type CliVerbosityLevel =
  | 'all'
  | 'none'
  | CliDebugTextTypes
  | Exclude<CliStateTextTypes, 'success'>;

/**
 * A function that generates a string to display in the CLI.
 */
export type CliStringGeneratorFn<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (args: TCliFnArgs<T>) => string | Promise<string>;

/**
 * A function that generates a boolean to determine if a text message should be displayed in the CLI.
 */
export type CliWhenFn<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (args: TCliFnArgs<T>) => boolean | Promise<boolean>;

/**
 * A function that acknowledges a text message in the CLI.
 */
export type CliTextAcknowledgementFn<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (args: TCliFnArgs<T>, ack: boolean) => void | Promise<void>;

/**
 * The text prompts that can be displayed in the CLI.
 */
export type CliTextPrompt<
  T extends Record<string, unknown> = Record<string, unknown>,
> =
  | TCliTextBasePrompt<T>
  | TCliStateTextPrompt<T>
  | TAcknowledgeableTextPrompt<T>;


export type CliInputTextPrompts<T extends Record<string, unknown> = Record<string, unknown>> =
  | TCliInputTextPrompt<T>
  | TCliInputTextValidatePrompt<T>
  | TCliInputTextChoicesPrompt<T>;

export type CliInputNumberPrompts<T extends Record<string, unknown> = Record<string, unknown>> =
  | TCliInputNumberPrompt<T>
  | TCliInputNumberRangePrompt<T>
  | TCliInputNumberValidatePrompt<T>;

/**
 * The input prompts that can be displayed in the CLI.
 */
export type CliInputPrompt<T extends Record<string, unknown> = Record<string, unknown>> = 
  | TCliInputTextPrompt<T>
  | TCliInputTextValidatePrompt<T>
  | TCliInputTextChoicesPrompt<T>
  | TCliInputNumberPrompt<T>
  | TCliInputNumberRangePrompt<T>
  | TCliInputNumberValidatePrompt<T>
  | TCliInputYesNoPrompt<T>
  | TCliInputConfirmPrompt<T>;

/**
 * A function that formats text in the CLI.
 */
export type CliFormatFn = (input: string) => string;

/**
 * All of the prompts that can be displayed in the CLI.
 */
export type CliPrompts<
  T extends Record<string, unknown> = Record<string, unknown>,
> = CliTextPrompt<T> | CliInputPrompt<T> | TCliDivergencePrompt<T>;
