import { join } from 'path';

let baseSettings = {
  name: 'neo-brick',
};

baseSettings = {
  ...baseSettings,
  path: join(process.env.temp, baseSettings.name),
};

baseSettings = {
  ...baseSettings,
  emulators: {
    raine: {
      executable: join(baseSettings.path, 'raine', 'raine.exe'),
    },
    mame: {
      executable: join(baseSettings.path, 'mame', 'mame64.exe'),
    },
  },
  tools: {
    cdTemplate: {
      url: 'http://azertyvortex.free.fr/download/neo-brick/cd-template.zip',
      path: join(baseSettings.path, 'cd-template'),
    },
    raine: {
      url: 'http://azertyvortex.free.fr/download/neo-brick/raine.zip',
      path: join(baseSettings.path, 'raine'),
      cfg: join(baseSettings.path, 'raine', 'config', 'raine32_sdl.cfg'),
    },
    mame: {
      url: 'http://azertyvortex.free.fr/download/neo-brick/mame-0.227.zip',
      path: join(baseSettings.path, 'mame'),
    },
    bin: {
      url: 'http://azertyvortex.free.fr/download/neo-brick/bin.zip',
      path: join(baseSettings.path, 'bin'),
    },
    neodev: {
      url: 'http://azertyvortex.free.fr/download/neo-brick/neodev-sdk.zip',
      path: join(baseSettings.path, 'neodev'),
    },
  },
};

const settings = baseSettings;

const {
  path,
  emulators,
  tools,
} = settings;

export default settings;
export {
  path,
  settings,
  emulators,
  tools,
};
