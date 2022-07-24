import { resolve as pResolve } from 'path';
import { builder } from '#src/lib/builder';

const start = () => {
  builder({ folder: pResolve('libc') });
};

start();
