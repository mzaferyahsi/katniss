/* jshint esversion: 6 */
/* eslint sonarjs/cognitive-complexity: "off" */

import { KafkaClient, Consumer, Producer, ConsumerGroup } from 'kafka-node';
import config from '../config/config';
import log4js from 'log4js';

export class Kafka {

  static getLogger() {
    if(!Kafka.logger) {
      Kafka.logger = log4js.getLogger();
      Kafka.logger.addContext('source', 'HeartBeatRoute');
    }

    return Kafka.logger;
  }

  static getClient () {
    return new Promise((resolve, reject) => {
      try {
        const client = new KafkaClient({ kafkaHost: config.kafka.hosts, maxAsyncRequests:config.kafka.maxAsyncRequests });

        resolve(client);
      } catch (e) {
        this.getLogger().error(e, e.stack);
        reject(e);
      }
    });
  }

  static getProducer (options, customPartitioner) {
    return new Promise((resolve, reject) => {
      this.getClient().then((client) => {
        try {
          const producer = new Producer(client, options, customPartitioner);
          resolve(producer);
        } catch (e) {
          this.getLogger().error(e, e.stack);
          reject(e);
        }
      }).catch((e) => {
        this.getLogger().error(e, e.stack);
        reject(e);
      });
    });
  }

  static getConsumer (payloads, options) {
    return new Promise((resolve, reject) => {
      this.getClient().then((client) => {
        try {
          const consumer = new Consumer(client, payloads, options);
          resolve(consumer);
        } catch (e) {
          this.getLogger().error(e, e.stack);
          reject(e);
        }
      }).catch((e) => {
        this.getLogger().error(e, e.stack);
        reject(e);
      });
    });
  }

  static getConsumerGroup (groupId, topics, options) {
    return new Promise((resolve, reject) => {
      try {

        if(!options)
          options = {};

        /* istanbul ignore else */
        if(!groupId && !options.groupId)
          return reject(new Error('No groupId defined.'));

        /* istanbul ignore else */
        if(!topics)
          return reject(new Error('No topics defined.'));

        /* istanbul ignore else */
        if(groupId && !options.groupId)
          options.groupId = groupId;
        else if(groupId && options.groupId && groupId !== options.groupId)
          return reject(new Error('groupId parameter and groupId in options does not match. Please use one of the two.'));

        /* istanbul ignore next */
        options.kafkaHost = options.kafkaHost ? options.kafkaHost : config.kafka.hosts;
        /* istanbul ignore next */
        options.protocol = options.protocol ? options.protocol : ['roundrobin'];
        /* istanbul ignore next */
        options.fromOffset = options.fromOffset ? options.fromOffset : 'earliest';
        /* istanbul ignore next */
        options.commitOffsetsOnFirstJoin = options.commitOffsetsOnFirstJoin ? options.commitOffsetsOnFirstJoin : true;
        /* istanbul ignore next */
        options.outOfRangeOffset = options.outOfRangeOffset ? options.outOfRangeOffset : 'earliest';
        /* istanbul ignore next */
        options.onRebalance = options.onRebalance ? options.onRebalance : (isAlreadyMember, callback) => {
          callback();
        };

        const consumerGroup = new ConsumerGroup(options, topics);
        resolve(consumerGroup);

      } catch (e) {
        this.getLogger().error(e, e.stack);
        reject(e);
      }
    });
  }
}
