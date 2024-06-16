# x-cli

Internal, experimental CLI utilities.

- promptNumber: number - Numeric, supports float, range, integer, regex, and
  function validation
- promptText: string - Text, supports regex or function validation
- promptBoolean: boolean - Yes/no input
- confirm: boolean - Confirm (any input other than 'confirm' or nothing is
  false)

# Design

Different prompt handlers

## text

```ts
interface ICliText {
  type: 'success' | 'info' | 'warn' | 'error';
  message: string | ({cli, props}) => Promise<string>;
  when?: ({cli, props}) => Promise<boolean>;
  required?: boolean;
  acknowledge?: boolean
}
```

### text.success

### text

```ts
const textSuccess = {};
```

### input.text

```ts
const textPrompt = {
  name: 'name', //  matches CLI option
  message: 'Enter your name', //  Supports a generative message as well () => string;
  defaultValue: 'John', //  Gets validated
  force: false, //  Whether to display if a valid default value is provided.
  required: false, //  Whether the value is required.
  helpText: '', //  The help text for the prompt. Supports a generative message as well () => string;
};

//  Can be used to validate a response
const validationFn = (cli, props) => string | undefined;
```
