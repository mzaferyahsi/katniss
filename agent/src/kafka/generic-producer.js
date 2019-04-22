/* jshint esversion: 6 */
import { Queue } from '../data-types/queue';
import log4js from 'log4js';
import { Kafka } from './index';
import config from '../config/config';

export class GenericKafkaProducer {
  static getLogger() {
    if (!GenericKafkaProducer.logger) {
      GenericKafkaProducer.logger = log4js.getLogger();
      GenericKafkaProducer.logger.addContext('source', 'GenericKafkaProducer');
    }

    return GenericKafkaProducer.logger;
  }

  static schedule() {
    this.getLogger().debug('Processing scheduled.');

    /* istanbul ignore else */
    if(!GenericKafkaProducer.scheduledJob)
      GenericKafkaProducer.scheduledJob = setInterval(GenericKafkaProducer.process.bind(GenericKafkaProducer),
        GenericKafkaProducer.interval ? GenericKafkaProducer.interval : config.kafka.producer.interval);
  }

  static unschedule() {
    this.getLogger().debug('Processing unscheduled.');
    clearInterval(GenericKafkaProducer.scheduledJob);
    GenericKafkaProducer.scheduledJob = undefined;
  }


  static add(message) {
    /* istanbul ignore else */
    if(!GenericKafkaProducer.queue)
      GenericKafkaProducer.queue = new Queue();

    return new Promise((resolve, reject) => {
      if(!message || message && (!message.topic || !message.messages ))
        return reject(new Error('Invalid kafka message!'));

      try {
        GenericKafkaProducer.queue.add(message);
        GenericKafkaProducer.getLogger().debug(`${JSON.stringify(message)} addad to queue.`);
        GenericKafkaProducer.schedule();
        resolve();
      } catch (e) {
        GenericKafkaProducer.getLogger().error(e);
        return reject(e);
      }
    });
  }

  static dequeue() {
    const payload = [];
    let count = 0;
    while(count < config.kafka.producer.messageCount && GenericKafkaProducer.queue.peek()) {
      GenericKafkaProducer.getLogger().debug(`Dequeueing ${JSON.stringify(GenericKafkaProducer.queue.peek())}`);

      const msg = GenericKafkaProducer.queue.remove();
      payload.push(msg);

      count++;
    }
    return payload;
  }

  static process() {
    if(!GenericKafkaProducer.isProcessing && GenericKafkaProducer.queue.peek()) {
      GenericKafkaProducer.isProcessing = true;

      while(GenericKafkaProducer.queue.peek()) {
        const payload = GenericKafkaProducer.dequeue();
        GenericKafkaProducer.publish(payload);
      }
      
      GenericKafkaProducer.isProcessing = false;
    }
  }
  
  static publish(messages) {
    if(!messages || messages && messages.length < 1)
      return;

    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    Kafka
      .getProducer({ partitionerType: 2 })
      .then(producer => {
        /* istanbul ignore next */
        producer.on('error', (e) => {
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
        GenericKafkaProducer.getLogger().error(e);

        messages.forEach(msg => {
          GenericKafkaProducer.add(msg);
        });
      });
  }

}
