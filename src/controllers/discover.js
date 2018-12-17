/* jshint esversion: 6 */
/* eslint no-unused-vars: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/cognitive-complexity: "off" */

import { FsScanner } from '../scanners/fs-scanner';
import { Kafka } from '../kafka';
import config from '../config/config';

import uuid from 'uuid/v4';
import log4js from 'log4js';

export class DiscoverController {
  /* istanbul ignore next */
  constructor () {
    this.fsScanner = new FsScanner();
    this.kafka = new Kafka();
  }

  discover (path) {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const logger = log4js.getLogger();
      logger.addContext('source', 'DiscoverController');
      logger.addContext('discoverId', id);

      this.fsScanner.discover(path).then((paths) => {
        logger.debug(`Completed discovering for ${id}`);
        /* istanbul ignore else */
        if (paths.length > 0)
          this.kafka.getProducer().then((producer) => {
            producer.on('error', (error) => {
              /* istanbul ignore next */
              logger.error(error);
            });

            producer.on('ready', () => {
              logger.debug('Pushing discovered paths to kafka');

              for (let i = 0; i < paths.length; i=i+100) {
                const payload = [];

                for (let j = 0; j < 100  && i+j < paths.length; j++) {
                  const msg = {
                    topic: config.kafka.topics.discoveredFiles,
                    messages: paths[i+j]
                  };

                  payload.push(msg);
                }

                producer.send(payload, (error) => {
                  /* istanbul ignore next */
                  if(error) {
                    logger.error('Unable to push data to kafka', error);
                    logger.error(error);
                  }
                });
              }
            });

          }).catch((error) => {
            logger.error(error);
          });

      }).catch((error) => {
        logger.error(error);
      });

      resolve(id);
    });
  }
}
