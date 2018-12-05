/* jshint esversion: 6 */
/* eslint no-unused-vars: "off" */
/* eslint no-useless-constructor: "off" */

import { FsScanner } from '../scanners/fs-scanner';
import { Kafka } from '../kafka';
import config from '../config/config';

import uuid from 'uuid/v4';

export class DiscoverController {
  constructor ({ fsScanner = null, kafka = null } = {}) {
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
  }

  discover (path) {
    const id = uuid();

    this.fsScanner.discover(path).then((paths) => {
      /* istanbul ignore else */
      if (paths.length > 0)
        this.kafka.getProducer().then((producer) => {
          producer.on('error', (err) => {
            /* istanbul ignore next */
            console.log(err);
          });

          producer.on('ready', () => {
            const payloads = [];
            paths.forEach((_path) => {
              payloads.push({
                topic: config.kafka.topics.discoveredFiles,
                messages: _path
              });
            });

            producer.send(payloads, (err) => {
              /* istanbul ignore next */
              console.log(err);
            });
          });

        }).catch((error) => {
          //TODO: handle error
        });
      
    }).catch((error) => {
      //TODO: Push errors to Kafka
    });

    return id;
  }
}
