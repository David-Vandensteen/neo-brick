import nodemon from 'nodemon';
import { parse } from 'path';

const { log, error } = console;
const { argv } = process;

log('args', process.argv);
if (!argv[2]) {
  error('argument is missing');
  process.exit(1);
}

nodemon({
  script: 'src/buildProject.js',
  args: [argv[2]],
  ext: 'c',
  watch: parse(argv[2]).dir,
}).on('start', () => {
  log('nodemon started');
}).on('crash', () => {
  log('script crashed for some reason');
});

nodemon.emit('restart');
nodemon.emit('quit');
