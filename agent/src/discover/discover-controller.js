/* jshint esversion: 6 */

import log4js from 'log4js';
import { FSUtility } from '../fs/utility';
import { Queue } from '../data-types/queue';
import config from '../config/config';
import { GenericKafkaProducer } from '../kafka/generic-producer';


export class DiscoverController {

  constructor() {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'DiscoverController');
    this.processQueue = new Queue();
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
            this.publish(path);

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

  publish(path) {
    const msg = {
      topic: config.kafka.topics.discoveredFiles,
      messages: path
    };
    this.logger.debug(`${path} discovered.`);
    GenericKafkaProducer.add(msg);
  }

}
