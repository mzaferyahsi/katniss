/* jshint esversion: 6 */

import log4js from 'log4js';
import { FSUtility } from '../fs/utility';
import { Queue } from '../data-types/queue';

export class FSDiscover {

  constructor(executor) {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'FSDiscover');
    this.processQueue = new Queue();

    if(!executor)
      throw new Error('No executer defined for FSDiscover.');

    this.executor = executor;
  }

  discover(path) {
    FSUtility.resolvePath(path)
      .then(FSUtility.exists)
      .then((resolvedPath) => {
        this.processQueue.add(resolvedPath);
        this.process();
      })
      .catch(e => this.logger.error(e));
  }

  process() {
    /* istanbul ignore else */
    if(!this.processorActive) {
      this.processorActive = true;
      while (this.processQueue.peek()) {
        const path = this.processQueue.remove();

        FSUtility
          .isDirectory(path)
          .then((isDirectory) => {
            this.executor(path);

            /* istanbul ignore else */
            if (isDirectory)
              this.discoverDirectoryContents(path);
          })
          .catch(e => this.logger.error(e));
      }
      this.processorActive = false;
    }
  }

  discoverDirectoryContents(path) {
    FSUtility
      .readDir(path)
      .then(paths => {
        for(const p of paths)
          this.processQueue.add(p);

        this.process();
      })
      .catch(e => this.logger.error(e));
  }

}
