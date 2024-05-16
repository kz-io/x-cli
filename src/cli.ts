/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Exports the Cli class.
 */

import {
  blue,
  bold,
  gray,
  green,
  italic,
  red,
  reset,
  rgb24,
  yellow,
} from '@std/fmt/colors';
import { CliVerbosity } from './types/enums.ts';
import {
  checkPermissions,
  createRequestRunner,
  parseCliArgs,
} from './_internal/mod.ts';

import type {
  CliNumericOptions,
  CliTextOptionDefined,
  CliTextOptions,
  ICliConfig,
  ICliOptions,
  ICliTextPromptOptions,
  ParsedCliArgs,
} from './types/mod.ts';

import i18n from './loc/mod.ts';
import {
  CliBoolOptionDefined,
  CliBoolOptions,
  CliNumericOptionDefined,
  CliOptionsRequest,
} from './types/type_aliases.ts';
import { XCliStrings } from './loc/strings.ts';
import { TLanguageSpec } from './types/interfaces.ts';
import { ICliConfirmOptions } from './mod.ts';
import { createAsyncRequestRunner } from './_internal/create_request_runner.ts';

const { default: fbLang, languages } = i18n;

export class Cli {
  public static async runAsync<T extends Record<string, unknown>>(
    config: Partial<ICliConfig>,
    fn: (cli: Cli) => Promise<ICliOptions & { data: T }>,
  ): Promise<ICliOptions & { data: T }> {
    return await fn(new Cli(config));
  }

  public static run<T extends Record<string, unknown>>(
    config: Partial<ICliConfig>,
    fn: (cli: Cli) => ICliOptions & { data: T },
  ): ICliOptions & { data: T } {
    return fn(new Cli(config));
  }

  public static request<T extends Record<string, unknown>>(
    config: Partial<ICliConfig>,
    requests: CliOptionsRequest[],
  ): ICliOptions & { data: T } {
    return Cli.run(config, createRequestRunner(requests));
  }

  public static async requestAsync<T extends Record<string, unknown>>(
    config: Partial<ICliConfig>,
    requests: CliOptionsRequest[],
  ): Promise<ICliOptions & { data: T }> {
    return await Cli.runAsync(config, createAsyncRequestRunner(requests));
  }

  protected _config: ICliConfig & ICliOptions;

  protected _args: ParsedCliArgs;

  protected strings: XCliStrings;

  constructor(config: Partial<ICliConfig> = {}) {
    const {
      args: rawArgs,
      banner,
      color,
      displayName,
      parseOptions,
      separator,
    } = config;
    const { verbosity, args, lang } = parseCliArgs(rawArgs || [], parseOptions);

    this.strings = this.findBestLanguage(lang).strings;
    const { Cli: $Cli } = this.strings;

    this._config = {
      args: rawArgs || [],
      banner: banner ||
        `${displayName || $Cli.defaultName} - ${$Cli.defaultBanner}`,
      color: color || 0x156AFF,
      displayName: displayName || $Cli.defaultName,
      parseOptions: parseOptions || {},
      separator: separator || ':',
      verbosity,
      lang,
    };

    this._args = args;
  }

  protected findBestLanguage(lang: string): TLanguageSpec<XCliStrings> {
    const language = languages.find((l) => {
      if (l.lang === lang) {
        return true;
      }

      return false;
    }) || languages.find((l) => {
      if (l.lang.split('-')[0] === lang.split('-')[0]) {
        return true;
      }

      return false;
    }) || languages.find((l) => l.lang === 'en');

    return language || fbLang;
  }

  public get rawArgs(): string[] {
    const { args } = this._config;

    return [...args];
  }

  public get args(): ParsedCliArgs {
    const args = { ...this._args };

    return args;
  }

  public get lang(): string {
    const { lang } = this._config;

    return lang;
  }

  public get verbosity(): CliVerbosity {
    const { verbosity } = this._config;

    return verbosity;
  }

  public get name(): string {
    const { displayName, color } = this._config;
    const name = rgb24(`[${displayName}]`, color);

    return name;
  }

  public async checkPermissions(
    permissions: Deno.PermissionDescriptor[],
    message = this.strings.Cli.requestPermissions,
  ): Promise<void> {
    const { Cli: $Cli } = this.strings;
    this.describe(message);

    const result = await checkPermissions(permissions);

    if (!result) {
      throw new Error($Cli.permissionDenied);
    }
  }

  protected formattedPrint(
    message: string,
    formatter: (message: string) => string,
  ): void {
    const { name } = this;
    const formattedMessage = formatter(message);
    const formattedText = `${name} ${formattedMessage}`;

    console.log(formattedText);
  }

  protected formatterLevelPrint(
    level: CliVerbosity,
    message: string,
    formatter: (message: string) => string,
  ): void {
    const { verbosity } = this._config;

    if (verbosity < level) {
      return;
    }

    this.formattedPrint(message, formatter);
  }

  protected printDebug(level: CliVerbosity, message: string): void {
    const formatter = (str: string) => italic(gray(str));

    this.formatterLevelPrint(level, message, formatter);
  }

  public printBanner(): void {
    const { banner } = this._config;

    console.log(banner);
  }

  public describe(message: string): void {
    const { name, _config } = this;
    const { color } = _config;
    const formattedMessage = bold(rgb24(message, color));
    const formattedText = `${name} ${formattedMessage}`;

    console.log(formattedText);
  }

  public write(message: string): void {
    this.formattedPrint(message, reset);
  }

  public complete(message: string): void {
    this.formattedPrint(message, green);
  }

  public error(message: string): void {
    this.formatterLevelPrint(CliVerbosity.Error, message, red);
  }

  public warn(message: string): void {
    this.formatterLevelPrint(CliVerbosity.Warn, message, yellow);
  }

  public info(message: string): void {
    this.formatterLevelPrint(CliVerbosity.Info, message, blue);
  }

  public success(message: string): void {
    this.formatterLevelPrint(CliVerbosity.Info, message, green);
  }

  public debug(message: string): void {
    this.printDebug(CliVerbosity.Debug, message);
  }

  public trace(message: string): void {
    this.printDebug(CliVerbosity.Trace, message);
  }

  protected getTextChoiceText(
    options?: Record<string, string>,
    defaultValue?: string,
  ): string {
    const { Cli: $Cli } = this.strings;

    if (!options) {
      return '';
    }

    const optionKeys = Object.keys(options);
    const formattedOptions = optionKeys.map(([initial]) => {
      if (initial.length > 1) {
        throw new Error($Cli.textChoiceNotChar);
      }

      if (initial.toLowerCase() !== initial) {
        throw new Error($Cli.textChoiceNotLower);
      }

      return defaultValue
        ? initial === defaultValue ? initial.toUpperCase() : initial
        : initial;
    });
    const optionString = formattedOptions.join('/');
    const formattedText = `[${optionString}/?]`;

    return formattedText;
  }

  protected getPromptMessage<T extends CliTextOptions>(
    options: T,
  ): string {
    const { name, _config } = this;
    const { separator } = _config;
    const { message } = options;
    const defaultValue = 'defaultValue' in options ? options.defaultValue : '';
    const choicesText = 'choices' in options
      ? this.getTextChoiceText(options.choices, defaultValue)
      : '';
    const styledMessage = reset(message);
    const text = `${name} ${styledMessage} ${separator} ${choicesText}`;
    const formattedText = bold(text);

    return formattedText;
  }

  protected validateChoice<
    C extends Record<string, string> = Record<string, string>,
  >(choice: string, options?: C): boolean {
    const { displayName } = this._config;

    if (!options) {
      return false;
    }

    if (choice === '?') {
      const optionEntries = Object.entries(options);

      const formattedOptions = optionEntries.map(([initial, desc]) => {
        const formattedText = `${initial} - ${desc}`;

        return formattedText;
      });
      const optionLines = formattedOptions.join(
        `\n${' '.repeat(displayName.length + 3)}`,
      );

      this.describe(optionLines);

      return false;
    }

    const keys = Object.keys(options);
    const valid = keys.some(([initial]) => initial === choice);

    return valid;
  }

  protected displayHelp(options: ICliTextPromptOptions): void {
    const { Cli: $Cli } = this.strings;
    const { helpText } = options;

    if (helpText) {
      this.describe(helpText);
    } else {
      this.warn($Cli.noHelp);
    }
  }

  public promptText<
    C extends Record<string, string> = Record<string, string>,
    T extends CliTextOptions<C, Extract<keyof C, string>> = CliTextOptions<
      C,
      Extract<keyof C, string>
    >,
  >(
    options: T,
  ): CliTextOptionDefined<T> {
    const { Cli: $Cli } = this.strings;
    const defaultValue = 'defaultValue' in options ? options.defaultValue : '';
    const required = 'required' in options ? options.required : false;
    const formattedMessage = this.getPromptMessage(options);

    const response = prompt(formattedMessage, defaultValue);
    const cleanResponse = (typeof response === 'string' ? response : '').trim();

    if (required && cleanResponse === '') {
      this.describe($Cli.invalidResponse);

      const retry = this.promptText(options);

      return retry;
    }

    if (cleanResponse === '?') {
      this.displayHelp(options);

      const retry = this.promptText(options);

      return retry;
    }

    if ('choices' in options) {
      const valid = this.validateChoice<C>(cleanResponse, options.choices);

      if (!valid) {
        const retry = this.promptText(options);

        return retry;
      }
    }

    if ('validationFn' in options) {
      const errorMessage = options.validationFn(cleanResponse);

      if (errorMessage) {
        this.describe(errorMessage);

        const retry = this.promptText(options);

        return retry;
      }
    }

    if ('validationRegex' in options) {
      const { format, validationRegex } = options;
      const tested = validationRegex.test(cleanResponse);

      if (!tested) {
        this.describe(`${$Cli.badFormat} ${format}`);

        const retry = this.promptText(options);

        return retry;
      }
    }

    if ('transformFn' in options) {
      const transformed = options.transformFn(cleanResponse);

      return transformed;
    }

    return cleanResponse;
  }

  public async promptTextAsync<
    C extends Record<string, string> = Record<string, string>,
    T extends CliTextOptions<C> = CliTextOptions<C>,
  >(
    options: T,
  ): Promise<CliTextOptionDefined<T>> {
    const { Cli: $Cli } = this.strings;
    const defaultValue = 'defaultValue' in options ? options.defaultValue : '';
    const required = 'required' in options ? options.required : false;
    const formattedMessage = this.getPromptMessage(options);

    const response = prompt(formattedMessage, defaultValue) || defaultValue;
    const cleanResponse = (typeof response === 'string' ? response : '').trim();

    if (required && cleanResponse === '') {
      this.describe($Cli.invalidResponse);

      const retry = await this.promptTextAsync(options);

      return retry;
    }

    if ('choices' in options) {
      const valid = this.validateChoice<C>(cleanResponse, options.choices);

      if (!valid) {
        const retry = this.promptTextAsync(options);

        return retry;
      }
    }

    if (cleanResponse === '?') {
      this.displayHelp(options);

      const retry = this.promptText(options);

      return retry;
    }

    if ('validationFn' in options) {
      const errorMessage = await options.validationFn(cleanResponse);

      if (errorMessage) {
        this.describe(errorMessage);

        const retry = await this.promptTextAsync(options);

        return retry;
      }
    }

    if ('validationRegex' in options) {
      const { format, validationRegex } = options;
      const tested = validationRegex.test(cleanResponse);

      if (!tested) {
        this.describe(`${$Cli.badFormat} ${format}`);

        const retry = this.promptTextAsync(options);

        return retry;
      }
    }

    if ('transformFn' in options) {
      const transformed = await options.transformFn(cleanResponse);

      return transformed;
    }

    return cleanResponse;
  }

  public promptNumber<T extends CliNumericOptions = CliNumericOptions>(
    options: T,
  ): CliNumericOptionDefined<T> {
    const { Cli: $Cli } = this.strings;
    const { integer } = options;
    const defaultValue = 'defaultValue' in options ? options.defaultValue : '';
    const required = 'required' in options ? options.required : false;
    const formattedMessage = this.getPromptMessage(options);

    const response = prompt(formattedMessage, `${defaultValue}`);
    const cleanResponse = (typeof response === 'string' ? response : '').trim();

    if (cleanResponse === '?') {
      this.displayHelp(options);

      const retry = this.promptNumber(options);

      return retry;
    }

    const parsedNumber = parseFloat(cleanResponse);

    if (required && isNaN(parsedNumber)) {
      this.describe($Cli.invalidResponse);

      const retry = this.promptNumber(options);

      return retry;
    }

    if (integer) {
      if (!Number.isInteger(parsedNumber)) {
        this.describe($Cli.notAnInteger);

        const retry = this.promptNumber(options);

        return retry;
      }
    }

    if ('min' in options && 'max' in options) {
      if (parsedNumber < options.min || parsedNumber > options.max) {
        this.describe(`${$Cli.rangeError} ${options.min}, ${options.max}.`);

        const retry = this.promptNumber(options);

        return retry;
      }
    }

    if ('validationFn' in options) {
      const errorMessage = options.validationFn(parsedNumber);

      if (errorMessage) {
        this.describe(errorMessage);

        const retry = this.promptNumber(options);

        return retry;
      }
    }

    if ('transformFn' in options) {
      const transformed = options.transformFn(parsedNumber);

      return transformed;
    }

    return parsedNumber;
  }

  public async promptNumberAsync<
    T extends CliNumericOptions = CliNumericOptions,
  >(options: T): Promise<CliNumericOptionDefined<T>> {
    const { Cli: $Cli } = this.strings;
    const { integer } = options;
    const defaultValue = 'defaultValue' in options ? options.defaultValue : '';
    const required = 'required' in options ? options.required : false;
    const formattedMessage = this.getPromptMessage(options);

    const response = prompt(formattedMessage, `${defaultValue}`);
    const cleanResponse = (typeof response === 'string' ? response : '').trim();

    if (cleanResponse === '?') {
      this.displayHelp(options);

      const retry = this.promptNumber(options);

      return retry;
    }

    const parsedNumber = parseFloat(cleanResponse);

    if (required && isNaN(parsedNumber)) {
      this.describe($Cli.invalidResponse);

      const retry = await this.promptNumberAsync(options);

      return retry;
    }

    if (integer) {
      if (!Number.isInteger(parsedNumber)) {
        this.describe($Cli.notAnInteger);

        const retry = await this.promptNumberAsync(options);

        return retry;
      }
    }

    if ('min' in options && 'max' in options) {
      if (parsedNumber < options.min || parsedNumber > options.max) {
        this.describe(`${$Cli.rangeError} ${options.min}, ${options.max}.`);

        const retry = await this.promptNumberAsync(options);

        return retry;
      }
    }

    if ('validationFn' in options) {
      const errorMessage = await options.validationFn(parsedNumber);

      if (errorMessage) {
        this.describe(errorMessage);

        const retry = await this.promptNumberAsync(options);

        return retry;
      }
    }

    if ('transformFn' in options) {
      const transformed = await options.transformFn(parsedNumber);

      return transformed;
    }

    return parsedNumber;
  }

  public promptYesNo<T extends CliBoolOptions = CliBoolOptions>(
    options: T,
  ): CliBoolOptionDefined<T> {
    const { Cli: $Cli } = this.strings;
    const { negate } = options;
    const defaultValue = 'defaultValue' in options
      ? options.defaultValue
      : false;
    const choices = { 'y': $Cli.trueString, 'n': $Cli.falseString };
    const defaultChoice = defaultValue ? 'y' : 'n';
    const response = this.promptText({
      ...options,
      choices,
      defaultValue: defaultChoice,
    });
    const boolResponse = response === 'y' ? true : false;
    const result = negate ? !boolResponse : boolResponse;

    return result;
  }

  public confirm(options: ICliConfirmOptions): boolean {
    const formattedMessage = this.getPromptMessage(options);
    const result = confirm(formattedMessage);

    return result;
  }
}
