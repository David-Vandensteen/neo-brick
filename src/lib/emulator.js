/* eslint-disable lines-between-class-members */
import { spawn } from 'child_process';

const { log } = console;

class Emulator {
  #config;
  #process;

  constructor(config) {
    this.#config = config;
  }

  start() {
    log('launch emulator ', this.#config.executable, this.#config.file);
    this.#process = spawn(this.#config.executable, [this.#config.file]);
    return this;
  }

  stop() {
    this.#process.kill();
    return this;
  }
}

export default Emulator;
export { Emulator };
