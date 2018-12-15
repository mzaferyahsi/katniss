/* jshint esversion: 6 */

import { KafkaClient, Consumer, Producer, ConsumerGroup } from 'kafka-node';
import config from '../config/config';

export class Kafka {

  constructor() {
    this.KafkaClient = KafkaClient;
    this.Consumer = Consumer;
    this.Producer = Producer;
    this.ConsumerGroup = ConsumerGroup;

    this.client = null;
  }

  getClient () {
    return new Promise((resolve, reject) => {
      try {
        /* istanbul ignore else */
        if(!this.client)
          this.client = new this.KafkaClient({ kafkaHost: config.kafka.hosts });

        resolve(this.client);
      } catch (e) {
        reject(e);
      }
    });
  }

  getProducer (options, customPartitioner) {
    return new Promise((resolve, reject) => {
      this.getClient().then((client) => {
        try {
          const producer = new this.Producer(client, options, customPartitioner);
          resolve(producer);
        } catch (e) {
          reject(e);
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getConsumer (payloads, options) {
    return new Promise((resolve, reject) => {
      this.getClient().then((client) => {
        try {
          const consumer = new this.Consumer(client, payloads, options);
          resolve(consumer);
        } catch (e) {
          reject(e);
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getConsumerGroup ({ groupId = null, topics = null, options = {} }) {
    return new Promise((resolve, reject) => {
      try {

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
        options.fromOffset = options.fromOffset ? options.fromOffset : 'latest';
        /* istanbul ignore next */
        options.commitOffsetsOnFirstJoin = options.commitOffsetsOnFirstJoin ? options.commitOffsetsOnFirstJoin : true;
        /* istanbul ignore next */
        options.outOfRangeOffset = options.outOfRangeOffset ? options.outOfRangeOffset : 'earliest';
        /* istanbul ignore next */
        options.onRebalance = options.onRebalance ? options.onRebalance : (isAlreadyMember, callback) => {
          callback();
        };

        const consumerGroup = new this.ConsumerGroup(options, topics);
        resolve(consumerGroup);

      } catch (e) {
        reject(e);
      }
    });
  }
}
