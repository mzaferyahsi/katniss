/* jshint esversion: 6 */
/* eslint no-unused-vars: "off" */
/* eslint no-useless-constructor: "off" */

import { FsScanner } from '../scanners/fs-scanner';
import { Kafka } from '../kafka';
import config from '../config/config';
import { Logger } from '../logging';

import uuid from 'uuid/v4';

export class DiscoverController {
  /* istanbul ignore next */
  constructor () {
    this.fsScanner = new FsScanner();
    this.kafka = new Kafka();
    this.logger = Logger.getLogger('DiscoverController');
  }

  discover (path) {
    const id = uuid();

    this.fsScanner.discover(path).then((paths) => {
      /* istanbul ignore else */
      if (paths.length > 0)
        this.kafka.getProducer().then((producer) => {
          producer.on('error', (error) => {
            /* istanbul ignore next */
            this.logger.logError(new Error().stack, error);
          });

          producer.on('ready', () => {
            const payloads = [];
            paths.forEach((_path) => {
              payloads.push({
                topic: config.kafka.topics.discoveredFiles,
                messages: _path
              });
            });

            producer.send(payloads, (error) => {
              /* istanbul ignore next */
              this.logger.logError(new Error().stack, error);
            });
          });

        }).catch((error) => {
          this.logger.logError(new Error().stack, error);
        });
      
    }).catch((error) => {
      this.logger.logError(new Error().stack, error);
    });

    return id;
  }
}
