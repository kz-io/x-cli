import { textTypeVerbosityMap, verbosityIndex } from './_internal/constants.ts';
import { text } from './format_fn.ts';
import { TCliInputTextChoicesPrompt } from './types/interfaces.ts';
import { TCliInputTransformPrompt } from './types/interfaces.ts';
import { ICliOptions, TCliTextBasePrompt, TCliDivergencePrompt, TCliInputYesNoPrompt, TCliInputConfirmPrompt } from './types/interfaces.ts';
import {
  CliAllTextTypes,
  CliInputNumberPrompts,
  CliInputPrompt,
  CliInputTextPrompts,
  CliPrompts,
  CliStringGeneratorFn,
  CliTextPrompt,
  CliVerbosityLevel,
} from './types/type_aliases.ts';

const TEXT_PROMPTS = Object.keys(text);

export class Cli<A extends Record<string, unknown> = Record<string, unknown>> {
  protected rawArgs: string[];

  protected banner?: string;

  protected name: string;

  protected description?: string;

  protected version?: string;

  protected url?: string;

  protected args: Partial<A>;

  protected verbosity: CliVerbosityLevel = 'none';

  protected padding: string;

  constructor(options: Partial<ICliOptions> = {}) {
    const { args, banner, description, name, parseOptions, url, version } =
      options;

    this.rawArgs = args || [];
    this.banner = banner;
    this.description = description;
    this.name = name || 'CLI';
    this.version = version;
    this.url = url;
    this.args = {} as A; //TODO(ebntly): Implement args parsing
    this.padding = ' '.repeat(this.name.length + 3);
    // parse cli-args(verbose, force, lang)
    // get internal language strings
  }

  protected printCliHeader(): void {
    const { banner, name, description, url, version } = this;

    const bannerString = banner ? `${banner}\n` : '';
    const versionString = version ? ` v${version}` : '';
    const descriptionString = description ? `\n${description}` : '';
    const urlString = url ? `\nSee more at: ${url}` : '';
    const infoString =
      `${name}${versionString}${descriptionString}${urlString}`;
    const headerString = `${bannerString}${infoString}\n`;

    console.log(headerString);
  }

  protected createMessage(message: string): string {
    return `[${this.name}] ${message}`;
  }

  protected async diverge<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompt: TCliDivergencePrompt<T>): Promise<void> {
    const { select, branches } = prompt;
    const selected = await select({ args: this.args as T });

    if (selected in branches) {
      const subPrompt = branches[selected];

      await this.prompts(subPrompt);
    }
  }

  public async prompt<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompts: CliPrompts<T>[]): Promise<T> {
    this.printCliHeader();

    return await this.prompts(prompts);
  }

  protected async prompts<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompts: CliPrompts<T>[]): Promise<T> {
    for (const prompt of prompts) {
      const { type } = prompt;
      if (type === 'divergence') {
          await this.diverge(prompt);
      } else if (TEXT_PROMPTS.includes(type)) {
        await this.printText<T>(prompt as CliTextPrompt<T>);
      } else {
        await this.request<T>(prompt as CliInputPrompt<T>);
      }
    }

    return {} as T;
  }

  protected async resolveMessage<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(message: CliStringGeneratorFn<T> | string): Promise<string> {
    const { args } = this;

    if (typeof message === 'string') {
      return message;
    }

    return await message({ args: args as T });
  }

  protected shouldDisplay(verbosity: CliAllTextTypes): boolean {
    const { verbosity: configuredVerbosity } = this;
    const mappedVerbosity = textTypeVerbosityMap.get(verbosity);

    if (!mappedVerbosity) {
      return true;
    }

    const index = verbosityIndex.indexOf(mappedVerbosity);
    const configuredIndex = verbosityIndex.indexOf(configuredVerbosity);

    if (index === -1 || configuredIndex === -1) {
      return true;
    }

    return configuredIndex <= index;
  }

  protected async printText<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompt: CliTextPrompt<T>): Promise<void> {
    const { args, padding } = this;
    const { type } = prompt;

    const resolvedMessage = await this.resolveMessage(prompt.message);
    const formatter = text[type as CliAllTextTypes];

    const display = ('required' in prompt || 'when' in prompt) 
      ? prompt.required !== undefined
        ? prompt.required
        : prompt.when !== undefined
          ? await prompt.when({ args: args as T })
          : false
      : this.shouldDisplay(type as CliAllTextTypes);

    if (!display) return;

    if ('acknowledge' in prompt && prompt.acknowledge) {
      const text = `${resolvedMessage}\n${padding}Acknowledge message?`;
      const message = this.createMessage(text);
      const formattedMessage = formatter(message);
      const result = confirm(formattedMessage);

      if (prompt.onAcknowledgement) {
        await prompt.onAcknowledgement({ args: args as T }, result);
      }

      return;
    }

    const message = this.createMessage(resolvedMessage)
    const formattedMessage = formatter(message);

    console.log(formattedMessage);
  }

  protected async request<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompt: CliInputPrompt<T>): Promise<void> {
    const { args } = this;
    const { type, name } = prompt;

    switch(type) {
      case 'yesno':
        args[name as keyof A] = await this.requestYesNo(prompt) as A[keyof A];
        break;
      case 'confirm':
        args[name as keyof A] = await this.confirm(prompt) as A[keyof A];
        break;
      case 'number':
      default:
        args[name as keyof A] = await this.requestInput(prompt) as A[keyof A];
        break;
    }
  }

  protected async confirm<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompt: TCliInputConfirmPrompt<T>): Promise<boolean> {
    const { message } = prompt;
    const resolvedMessage = await this.resolveMessage(message);
    const formattedMessage = text.label(resolvedMessage);

    return confirm(formattedMessage);
  };

  protected getChoices(choices: Record<string, string>, defaultValue?: string): string {
    const validated = Object.keys(choices).map((key) => {
      if (key.length > 1) {
        throw new Error('Choices must be single characters');
      }

      if (key.toLowerCase() !== key) {
        throw new Error('Choices must be lowercase');
      }

      if (key === defaultValue) {
        return key.toUpperCase();
      }

      return key;
    });

    const choiceString = `[${validated.join('|')}]`;

    return choiceString;
  }

  protected async requestInput<
    T extends Record<string, unknown> = Record<string, unknown>
  >(prompt: CliInputTextPrompts<T> | CliInputNumberPrompts<T>): Promise<string> {
    const { type } = prompt;
    // route type text/number
   
    return '';
  }

  protected async requestInputText<
  T extends Record<string, unknown> = Record<string, unknown>
>(prompt: CliInputTextPrompts<T>): Promise<string> {
    const { message, helpText, defaultValue } = prompt;
    const resolvedMessage = await this.resolveMessage(message);
    const resolvedHelpText = helpText ? await this.resolveMessage(helpText) : '';

    const formattedMessage = text.label(resolvedMessage);
    const formattedHelpText = resolvedHelpText ? text.info(resolvedHelpText) : '';

    const messageString = `${formattedMessage} ${formattedHelpText}`;

    return '';
  }

  protected async requestYesNo<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(prompt: TCliInputYesNoPrompt<T>): Promise<boolean> {
    const {defaultValue, ...rest} = prompt;
    const choices = {
      'y': 'Yes',
      'n': 'No',
    };

    const request = defaultValue !== undefined
      ? {...rest, type: ('text' as const), choices, defaultValue: defaultValue ? 'y' : 'n'}
      : {...rest, type: ('text' as const), choices};

    const result = await this.requestInput(request);

    return result === 'y';
  }

  // inputText  
  // inputNumber
  // inputYesNo
  // inputPassword
  // inputConfirm
}
