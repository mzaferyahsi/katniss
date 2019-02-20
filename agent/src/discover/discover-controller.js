/* jshint esversion: 6 */

import { FSDiscover } from './fs-discover';
import log4js  from 'log4js';
import { Kafka } from '../kafka';
import { Queue } from '../data-types/queue';
import config from '../config/config';

export class DiscoverController {
  constructor(options = { processInterval : 1000 }) {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'DiscoverController');
    this.queue = new Queue();
    this.processInterval = options.processInterval;
    this.fsDiscover = new FSDiscover(this.discoverExecutor);
    this.schedule();

    process.on('exit', this.unschedule);
  }

  schedule() {
    this.unschedule();
    this.scheduledJob = setTimeout(this.processQueue.bind(this), this.processInterval);
  }

  unschedule() {
    clearTimeout(this.scheduledJob);
  }

  discoverExecutor (item) {
    this.queue.add(item);
  }

  dequeue() {
    const payload = [];
    let count = 0;
    while(count < 100 && this.queue.peek()) {
      const msg = {
        topic: config.kafka.topics.discoveredFiles,
        messages: this.queue.remove()
      };

      payload.push(msg);
      count++;
    }

    return payload;
  }

  processQueue() {
    /* istanbul ignore else */
    if(!this.isProcessQueueActive && this.queue.peek()) {
      this.isProcessQueueActive = true;

      while(this.queue.peek()) {
        const payload = this.dequeue();
        this.publishMessages(payload);
      }

      this.isProcessQueueActive = false;
    }
    this.schedule();
  }

  publishMessages (messages) {
    Kafka
      .getProducer()
      .then(producer => {
        producer.on('error', (e) => {
          /* istanbul ignore next */
          throw e;
        });

        producer.on('ready', () => {
          producer.send(messages, (e) => {
            /* istanbul ignore next */
            if(e)
              throw e;

          });
        });
      })
      .catch(e => {
        this.logger.error(e);

        messages.forEach(msg => {
          this.queue.add(msg.messages);
        });
      });
  }
}
