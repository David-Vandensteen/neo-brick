import { mkdirSync, existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import download from 'download';
import pAll from 'p-all';
import { tools } from '#src/settings';

const { log } = console;

const downloadAndExtract = ({ url, dest }) => {
  log('url :', url);
  log('dest :', dest);
  log('');
  if (existsSync(dest)) {
    log(dest, 'already exist');
    log('download is skipped');
    log('');
    return Promise.resolve();
  }
  mkdirSync(dest, { recursive: true });
  return download(url, dest, { extract: true });
};

const raineSettings = ({ cfg }) => readFile(cfg)
  .then((content) => {
    if (!content.toString().includes('/*neocd_bios*/')) return Promise.resolve();
    log('raine setting bios');
    const replaced = content.toString().replace('/*neocd_bios*/', `neocd_bios = ${tools.raine.path}\\roms\\NEOCD.BIN`);
    return writeFile(cfg, replaced);
  });

const downloadAll = ({
  cdTemplate,
  raine,
  mame,
  bin,
  neodev,
}) => pAll([
  () => downloadAndExtract({ url: cdTemplate.url, dest: cdTemplate.path }),
  () => downloadAndExtract({ url: raine.url, dest: raine.path }),
  () => downloadAndExtract({ url: mame.url, dest: mame.path }),
  () => downloadAndExtract({ url: bin.url, dest: bin.path }),
  () => downloadAndExtract({ url: neodev.url, dest: neodev.path }),
], { concurrency: 1 });

const start = (options) => {
  const {
    cdTemplate,
    raine,
    mame,
    bin,
    neodev,
  } = options;

  downloadAll({
    cdTemplate,
    raine,
    mame,
    bin,
    neodev,
  })
    .then(() => {
      raineSettings({ cfg: raine.cfg });
    });
};

start(tools);
