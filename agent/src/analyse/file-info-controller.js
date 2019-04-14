/* jshint esversion: 6 */

import log4js from 'log4js';
import { Queue } from '../data-types/queue';
import config from '../config/config';
import { Kafka } from '../kafka';
import { FileType } from '../fs/file-type';
import { FSUtility } from '../fs/utility';
import md5 from 'md5';
import { GenericKafkaProducer } from '../kafka/generic-producer';

export class FileInfoController {
  constructor(options = { processInterval : 1000, initialize: true }) {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'FileInfoController');
    this.queue = new Queue();
    this.processInterval = options.processInterval;
    if(options.initialize)
      this.initialize();
  }

  schedule() {
    this.unschedule();
    this.scheduledJob = setTimeout(this.processQueue.bind(this), this.processInterval);
  }

  unschedule() {
    clearTimeout(this.scheduledJob);
  }

  initialize() {
    return new Promise((resolve, reject) => {
      process.on('exit', this.unschedule);
      this.isProcessQueueActive = false;
      this.schedule();

      this.initializeListener()
        .then(resolve)
        .catch(e => {
          this.logger.error(e);
          reject(e);
        });
    });
  }

  initializeListener() {
    return new Promise((resolve, reject) => {
      Kafka
        .getConsumerGroup(config.kafka.consumerGroupId, config.kafka.topics.discoveredFiles)
        .then(consumer => {
          this.consumer = consumer;
          this.consumer.on('message', this.handleKafkaMessage.bind(this));
          this.consumer.on('error', this.handleKafkaError.bind(this));
        })
        .then(resolve)
        .catch(reject);
    });
  }

  handleKafkaMessage(message) {
    /* istanbul ignore else */
    if(message)
    {
      this.pauseKafkaConsumer();
      this.logger.debug(message);

      this
        .getFileInfo(message.value)
        .then((fileInfo) => this.queue.add(fileInfo))
        .catch(this.handleKafkaError.bind(this))
        .finally(() => {
          this.resumeKafkaConsumer();
        });
    }
  }

  handleKafkaError(e) {
    this.logger.error(e);
  }

  pauseKafkaConsumer() {
    this.consumer.pause();
  }

  resumeKafkaConsumer() {
    this.consumer.resume();
  }

  getFileInfo(path) {
    return new Promise((resolve, reject) => {
      this.logger.debug(`Processing ${path}`);

      const fileInfo = { path : path };
      FileType
        .get(fileInfo.path)
        .then((type) => {
          fileInfo.type = type;
          return fileInfo.path;
        })
        .then(FSUtility.getFileStats)
        .then((stats) => {
          fileInfo.createDate = stats.ctime;
          fileInfo.createDateMs = stats.ctimeMs;
          fileInfo.addDate = stats.atime;
          fileInfo.addDateMs = stats.atimeMs;
          fileInfo.modifiedDate = stats.mtime;
          fileInfo.modifiedDateMs = stats.mtimeMs;
          fileInfo.size = stats.size;
          return fileInfo.path;
        })
        .then(FSUtility.readFile)
        .then(md5)
        .then((hash) => {
          fileInfo.md5 = hash;
        })
        .then(() => {
          return fileInfo;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  processQueue() {
    /* istanbul ignore else */
    if(!this.isProcessQueueActive && this.queue.peek()) {
      this.isProcessQueueActive = true;

      while(this.queue.peek()) {
        const msg = {
          topic: config.kafka.topics.files,
          messages: JSON.stringify(this.queue.remove())
        };

        GenericKafkaProducer.add(msg)
          .catch(e => {
            /* istanbul ignore next */
            this.logger.error(e);
          });
      }

      this.isProcessQueueActive = false;
    }

    this.schedule();
  }

}
