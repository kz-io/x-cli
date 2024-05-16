import { Cli } from '../cli.ts';
import {} from '../mod.ts';
import { CliOptionsRequest, ICliOptions } from '../types/mod.ts';

export function createRequestRunner<
  T extends Record<string, unknown> = Record<string, unknown>,
>(requests: CliOptionsRequest[]): (cli: Cli) => ICliOptions & { data: T } {
  const data: Partial<T> = {};

  return function (cli: Cli): ICliOptions & { data: T } {
    const { args } = cli;

    for (const request of requests) {
      const { type, name } = request;

      switch (type) {
        case 'text':
          data[name as keyof T] = cli.promptText({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'numeric':
          data[name as keyof T] = cli.promptNumber({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'bool':
          data[name as keyof T] = cli.promptYesNo({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        default:
          data[name as keyof T] = cli.confirm(request) as T[keyof T];
          break;
      }
    }

    return {
      data: data as T,
      verbosity: cli.verbosity,
      lang: cli.lang,
    };
  };
}

export function createAsyncRequestRunner<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  requests: CliOptionsRequest[],
): (cli: Cli) => Promise<ICliOptions & { data: T }> {
  const data: Partial<T> = {};

  return async function (cli: Cli): Promise<ICliOptions & { data: T }> {
    const { args } = cli;

    for (const request of requests) {
      const { type, name } = request;

      switch (type) {
        case 'text':
          data[name as keyof T] = cli.promptText({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'text-async':
          data[name as keyof T] = await cli.promptTextAsync({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'numeric':
          data[name as keyof T] = cli.promptNumber({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'numeric-async':
          data[name as keyof T] = await cli.promptNumberAsync({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        case 'bool':
          data[name as keyof T] = cli.promptYesNo({
            ...request,
            defaultValue: args[name],
          }) as T[keyof T];
          break;
        default:
          data[name as keyof T] = cli.confirm(request) as T[keyof T];
          break;
      }
    }

    return {
      data: data as T,
      verbosity: cli.verbosity,
      lang: cli.lang,
    };
  };
}
