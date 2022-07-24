import { resolve } from 'path';
import { emulators } from '#src/settings';

export default {
  emulator: {
    file: `${process.env.temp}\\neo-brick\\hello\\compiled\\hello.bin`,
    executable: emulators.mame.executable,
  },
  builder: {
    projectName: 'hello',
    sourceFolder: resolve('neogeo-project\\hello'),
    makefile: resolve('neogeo-project\\Makefile'),
    output: {
      compiledFolder: `${process.env.temp}\\neo-brick\\out-project\\hello\\compiled`,
      ISOFolder: `${process.env.temp}\\neo-brick\\out-project\\hello\\iso`,
      ISOFilePath: `${process.env.temp}\\neo-brick\\out-project\\hello\\hello.iso`,
    },
  },
};
