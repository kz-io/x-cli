import { XCliStrings } from './strings.ts';

const strings: XCliStrings = {
  Cli: {
    requestPermissions: 'Requesting permissions...',
    defaultBanner: 'Welcome to the CLI',
    defaultName: 'CLI',
    textChoiceNotChar: 'Text choices must be a single character.',
    textChoiceNotLower: 'Text choices must be lowercase.',
    noHelp: 'No help text available.',
    invalidResponse: 'A valid response is required.',
    badFormat: 'Response does not match the format:',
    notAnInteger: 'Response must be an integer.',
    rangeError: 'Response must be between the following, inclusively:',
    trueString: 'True, yes, on',
    falseString: 'False, no, off',
    permissionDenied: 'Permission denied.',
  },
};

export default strings;
