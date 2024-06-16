import { Cli } from '../mod.ts';

async function main(argstring: string[]): Promise<void> {
  const cli = new Cli();

  const result = await cli.prompt<{
    okay: boolean;
    ackWarning: boolean
  }>([
    {
      type: 'yesno',
      name: 'okay',
      message: 'Are you okay?',
      required: true,
    },
    {
      type: 'warning',
      message: () => 'This is a warning',
      required: true,
      acknowledge: true,
      onAcknowledgement: ({args}, ack) => {
        args.ackWarning = ack;
      }
    },
    {
      type: 'divergence',
      select: ({args}) => args.ackWarning ? 'acknowledged' : 'notAcknowledged',
      branches: {
        acknowledged: [
        {
            type: 'info',
            message: 'Warning was acknowledged',
            required: true,
          }
        ],
        notAcknowledged: [
          {
            type: 'warning',
            message: 'Warning was NOT acknowledged',
            required: true,
          }
        ]
      }
    }
  ]);

  // const result = Cli.request<{
  //   host: string;
  //   ip: string;
  // }>({
  //   args: argstring,
  //   banner: 'My simple cli',
  //   displayName: 'MSC',
  // }, [
  //   {
  //     name: 'host',
  //     type: 'text',
  //     message: 'What is the device name?',
  //     validationRegex: /[a-zA-Z0-9]{15}/,
  //     format: 'Hostname exactly 15 alpha-numeric characters',
  //     transformFn: (input: string) => input.toUpperCase(),
  //   },
  //   {
  //     name: 'ip',
  //     type: 'text',
  //     message: 'What is the device IP and mask?',
  //     validationRegex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}/,
  //   },
  //   {
  //     name: 'gateway',
  //     type: 'text',
  //     message: 'What is the gateway IP for ${ip}?',
  //     validationRegex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  //   },
  // ]);

  console.log(result);
}

main(Deno.args);
