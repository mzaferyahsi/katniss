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
  constructor ({ fsScanner = null, kafka = null, logger = null } = {}) {
    /* istanbul ignore else */
    if(fsScanner)
      this.fsScanner = fsScanner;
    else
      this.fsScanner = new FsScanner();
      
    /* istanbul ignore else */
    if(kafka)
      this.kafka = kafka;
    else
      this.kafka = new Kafka();

    /* istanbul ignore else */
    if(logger)
      this.logger = logger;
    else
      this.logger = Logger.getLogger({ className: 'DiscoverController' });
  }

  discover (path) {
    const id = uuid();

    this.fsScanner.discover(path).then((paths) => {
      /* istanbul ignore else */
      if (paths.length > 0)
        this.kafka.getProducer().then((producer) => {
          producer.on('error', (error) => {
            /* istanbul ignore next */
            this.logger.logError(error);
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
              this.logger.logError(error);
            });
          });

        }).catch((error) => {
          this.logger.logError(error);
        });
      
    }).catch((error) => {
      this.logger.logError(error);
    });

    return id;
  }
}
