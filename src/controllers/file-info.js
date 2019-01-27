/* jshint esversion: 6 */

import log4js from 'log4js';
import { Kafka } from '../kafka';
import config from '../config/config';

export class FileInfoController {

  constructor() {

    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'FileInfoController');
    this.kafka = new Kafka();

  }

  initialize() {
    this.kafka.getConsumerGroup(config.kafka.consumerGroupId, [config.kafka.topics.discoveredFiles]).then((consumerGroup) => {
      this.consumerGroup = consumerGroup;

      process.on('exit', this.handleClose.bind(this));

      this.kafka.getProducer().then((producer) => {
        this.producer = producer;

        this.consumerGroup.on('message', this.handleMessage.bind(this));
        this.consumerGroup.on('error', this.handleError.bind(this));
        this.consumerGroup.on('connect', this.handleConnect.bind(this));
      });

    });
  }

  handleConnect() {
    this.logger.debug('FileInfoController started listening');
  }

  handleClose() {
    this.logger.debug('Closing kafka connection for FileInfoController');
    if(this.consumerGroup)
      this.consumerGroup.close();
  }

  handleMessage(message) {
    this.logger.debug(message);
  }

  handleError(error) {
    this.logger.error(error);
  }

}
