import {
  resolve,
  sep,
} from 'path';
import { builder } from '#src/lib/builder';
import { Emulator } from '#src/lib/emulator';

const { log, error } = console;

const build = ({ configFile }) => {
  let configFileProcessed = configFile;
  if (sep === '/') configFileProcessed = configFile;
  if (sep === '\\') {
    configFileProcessed = `file://${configFile}`;
  }

  let config = {};
  import(configFileProcessed)
    .then((data) => {
      config = { ...data.default };
      log('config', config);
      builder(config.builder)
        .then(() => {
          const emulator = new Emulator(config.emulator);
          emulator.start();
        })
        .catch(error);
    });
};

if (!process.argv[2]) {
  error('argment is missing');
  process.exit(1);
}
const configFile = resolve(process.argv[2]);
build({ configFile });
