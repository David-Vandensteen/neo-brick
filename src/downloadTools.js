import { mkdirSync, existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

import download from 'download';
import pAll from 'p-all';

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
    const replaced = content.toString().replace('/*neocd_bios*/', `neocd_bios = ${process.env.TEMP}\\neocore\\raine\\roms\\NEOCD.BIN`);
    return writeFile(cfg, replaced);
  });

const downloadAll = () => pAll([
  () => downloadAndExtract({ url: 'http://azertyvortex.free.fr/download/neo-brick/cd-template.zip', dest: `${process.env.TEMP}\\neo-brick\\cd-template` }),
  () => downloadAndExtract({ url: 'http://azertyvortex.free.fr/download/neo-brick/raine.zip', dest: `${process.env.TEMP}\\neo-brick\\raine` }),
  () => downloadAndExtract({ url: 'http://azertyvortex.free.fr/download/neo-brick/mame-0.227.zip', dest: `${process.env.TEMP}\\neo-brick\\mame` }),
  () => downloadAndExtract({ url: 'http://azertyvortex.free.fr/download/neo-brick/bin.zip', dest: `${process.env.TEMP}\\neo-brick\\bin` }),
  () => downloadAndExtract({ url: 'http://azertyvortex.free.fr/download/neo-brick/neodev-sdk.zip', dest: `${process.env.TEMP}\\neo-brick\\neodev` }),
], { concurrency: 1 });

const main = () => {
  downloadAll()
    .then(() => {
      raineSettings({ cfg: `${process.env.TEMP}\\neo-brick\\raine\\config\\raine32_sdl.cfg` });
    });
};

main();
