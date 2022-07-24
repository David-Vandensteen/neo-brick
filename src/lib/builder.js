import { spawn } from 'child_process';
import { mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { tools } from '#src/settings';

const { log, error } = console;

const updateEnv = ({
  projectName,
  binPath,
  neodevPath,
}) => {
  if (projectName) process.env.project = projectName;
  const neodevBin = join(neodevPath, 'm68k', 'bin');
  const sys32 = join(process.env.windir, 'system32');
  process.env.neodev = neodevPath;
  process.env.path = `${neodevBin};${sys32};${binPath}`;
  log('neodev :', process.env.neodev);
  log('path :', process.env.path);
  if (projectName) log('project :', process.env.project);
};

const make = ({ folder, makefile }) => {
  log('build:', folder);
  return new Promise((resolve, reject) => {
    let builder;
    if (!makefile) builder = spawn('cmd', ['/c', 'pushd', folder, '&', 'make', '&', 'popd']);
    if (makefile) builder = spawn('cmd', ['/c', 'pushd', folder, '&', 'make', '-f', makefile, '&', 'popd']);
    builder.stdout.on('data', (data) => {
      log(data.toString());
    });
    builder.stderr.on('data', (data) => {
      error(data.toString());
      reject(data.toString);
    });
    builder.once('close', (exitCode) => {
      if (exitCode === 0) resolve(exitCode);
      if (exitCode !== 0) {
        error('compilation error, make return code :', exitCode);
        reject(exitCode);
      }
    });
  });
};

const buildISO = ({
  mkisofs,
  cdTemplatePath,
  programFilePath,
  isoFilePath,
  projectName,
}) => {
  log('build iso options :', mkisofs, cdTemplatePath, programFilePath, isoFilePath);
  const isoFlatPath = join(project.buildPath, projectName, 'iso');
  mkdirSync(isoFlatPath);
  const files = [
    'ABS.TXT',
    'BIB.TXT',
    'CPY.TXT',
    'DEMO.FIX',
    'DEMO.PCM',
    'DEMO.Z80',
    'IPL.TXT',
  ];

  files.map((file) => copyFileSync(join(cdTemplatePath, file), join(isoFlatPath, file)));

  return new Promise((resolve, reject) => {
    const ISOBuilder = spawn(mkisofs, ['-o', isoFilePath, '-pad']);
    ISOBuilder.stdout.on('data', (data) => {
      log(data.toString());
    });
    ISOBuilder.stderr.on('data', (data) => {
      error(data.toString());
    });
    ISOBuilder.once('close', (exitCode) => {
      if (exitCode === 0) resolve(exitCode);
      if (exitCode !== 0) {
        error('build iso error, return code :', exitCode);
        reject(exitCode);
      }
    });
  });
};

const builder = (options) => {
  const builderOptions = {
    ...options,
    binPath: tools.bin.path,
    neodevPath: tools.neodev.path,
  };
  log('builder options :', builderOptions);
  updateEnv(builderOptions);
  return make(options)
    .then(() => buildISO({
      mkisofs: join(builderOptions.binPath, 'mkisofs.exe'),
      cdTemplatePath: tools.cdTemplate.path,
      programFilePath: options.outputProgram,
      projectName: options.projectName,
    }));
};

export default builder;
export {
  updateEnv,
  make,
  builder,
  buildISO,
};
