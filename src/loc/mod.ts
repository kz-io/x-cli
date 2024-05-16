import { TLanguageSpec } from '../types/interfaces.ts';
import strings from './en.ts';
import _en from './en.ts';
import _pirate from './pirate.ts';
import { XCliStrings } from './strings.ts';

const languages: TLanguageSpec<XCliStrings>[] = [
  {
    lang: 'en-US',
    strings: _en,
  },
  {
    lang: 'pirate',
    strings: _pirate,
  },
];

export default {
  default: {
    lang: 'en-US',
    strings,
  },
  languages,
};
