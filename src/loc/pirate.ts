import { XCliStrings } from './strings.ts';

const strings: XCliStrings = {
  Cli: {
    requestPermissions: 'AAAARG!!! - Requesting permissions...',
    defaultBanner: 'AAAARG!!! - Welcome to the CLI',
    defaultName: 'AAAARG!!! - CLI',
    textChoiceNotChar: 'AAAARG!!! - Text choices must be a single character.',
    textChoiceNotLower: 'AAAARG!!! - Text choices must be lowercase.',
    noHelp: 'AAAARG!!! - No help text available.',
    invalidResponse: 'AAAARG!!! - A valid response is required.',
    badFormat: 'AAAARG!!! - Response does not match the format:',
    notAnInteger: 'AAAARG!!! - Response must be an integer.',
    rangeError:
      'AAAARG!!! - Response must be between the following, inclusively:',
    trueString: 'AAAARG!!! - True, yes, on',
    falseString: 'AAAARG!!! - False, no, off',
    permissionDenied: 'AAAARG!!! - Permission denied.',
  },
};

export default strings;
