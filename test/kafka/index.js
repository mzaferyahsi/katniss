/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { Kafka } from '../../src/kafka';
import { expect } from 'chai';
import config from '../../src/config/config';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import log4jsConfig from '../log4js';

describe('Kafka', () => {

  let sandbox = null;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should initiate new Kafka instance', done => {
    try {

      const kafka = new Kafka();
      expect(kafka).to.be.not.null;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should return stubbed kafka client', done => {

    class Stub {
      constructor (options) {
      }

      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }
    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: Stub
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getClient().then((client) => {
      expect(client).to.be.not.null;
      // expect(client).to.be.a('Object');
      return done();
    }).catch((e) => {
      return done(`failed: ${e}`);
    });
  });


  it('should handle error when returning kafka client', done => {
    class Stub {
      constructor () {
        throw new Error('Error!');
      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: Stub
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getClient().then(() => {
      return done('Unable to fail');
    }).catch(() => {
      return done();
    });
  });

  it('should return stubbed consumer', done => {
    class StubClient {
      constructor(options) {

      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubConsumer {
      constructor(client, payload, options) {
        this.client = client;
        this.payload = payload;
        this.options = options;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumer({}, {}).then((consumer) => {
      expect(consumer).to.be.not.null;
      expect(consumer.payload).to.be.a('Object');
      expect(consumer.options).to.be.a('Object');
      done();
    }).catch((e) => {
      done(e);
    });
  });

  it('should handle error when returning stubbed consumer', done => {
    class StubClient {
      constructor(options) {
        throw new Error('ERROR!');
      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubConsumer {
      constructor(client, payload, options) {
        this.client = client;
        this.payload = payload;
        this.options = options;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumer({}, {}).then((consumer) => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e.message).to.be.eq('ERROR!');
      done();
    });
  });

  it('should handle error when initializing stubbed consumer', done => {
    class StubClient {
      constructor(options) {
      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubConsumer {
      constructor(client, payload, options) {
        throw new Error('ERROR!');
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumer({}, {}).then((consumer) => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e.message).to.be.eq('ERROR!');
      done();
    });
  });

  it('should return stubbed producer', done => {
    class StubClient {
      constructor(options) {

      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubProducer {
      constructor(client, options, customPartitioner) {
        this.client = client;
        this.customPartitioner = customPartitioner;
        this.options = options;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getProducer({}, {}).then((producer) => {
      expect(producer).to.be.not.null;
      expect(producer.customPartitioner).to.be.a('Object');
      expect(producer.options).to.be.a('Object');
      done();
    }).catch((e) => {
      done(e);
    });
  });

  it('should handle error returning stubbed producer', done => {
    class StubClient {
      constructor(options) {
        throw new Error('ERROR!');
      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubProducer {
      constructor(client, options, customPartitioner) {
        this.client = client;
        this.customPartitioner = customPartitioner;
        this.options = options;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getProducer({}, {}).then((producer) => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e.message).to.be.eq('ERROR!');
      done();
    });
  });

  it('should handle error when initializing stubbed producer', done => {
    class StubClient {
      constructor(options) {
      }
      createTopics(topics, callback) {
        setTimeout(() => {
          callback(null, {});
        }, 5);
      }
    }

    class StubProducer {
      constructor(client, options, customPartitioner) {
        throw new Error('ERROR!');
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getProducer({}, {}).then((producer) => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e.message).to.be.eq('ERROR!');
      done();
    });
  });

  it('should return consumer group', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        this.options = options;
        this.topics = topics;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup('id', ['topic'], {}).then(consumerGroup => {

      expect(consumerGroup).to.be.not.null;
      expect(consumerGroup.options.kafkaHost).to.be.eq(config.kafka.hosts);
      expect(consumerGroup.topics).to.be.a('Array');
      expect(consumerGroup.topics.length).to.be.eq(1);
      done();
    }).catch((e) => {
      done(e);
    });
  });

  it('should fail returning consumer group with no topics', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        this.options = options;
        this.topics = topics;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup('id',['topic'], {}).then(consumerGroup => {

      expect(consumerGroup).to.be.not.null;
      expect(consumerGroup.options.kafkaHost).to.be.eq(config.kafka.hosts);
      expect(consumerGroup.topics).to.be.a('Array');
      expect(consumerGroup.topics.length).to.be.eq(1);
      done();
    }).catch((e) => {
      done(e);
    });
  });

  it('should fail returning consumer group without groupId', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        this.options = options;
        this.topics = topics;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup(undefined, ['topic'] ).then(consumerGroup => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e).to.be.not.null;
      done();
    });
  });

  it('should fail returning consumer group with ambiguous groupId', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        this.options = options;
        this.topics = topics;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup('id', ['topic'], { groupId: 'differentId' }).then(consumerGroup => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e).to.be.not.null;
      done();
    });
  });

  it('should fail returning consumer group without topics', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        this.options = options;
        this.topics = topics;
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup('a' ).then(consumerGroup => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e).to.be.not.null;
      done();
    });
  });


  it('should fail initiating consumerGroup', done => {
    class StubConsumerGroup {
      constructor(options, topics) {
        throw new Error('ERROR!');
      }
    }

    const _Kafka = proxyquire('../../src/kafka', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    const kafka = new _Kafka();

    kafka.getConsumerGroup('a', ['topic']).then(consumerGroup => {
      done('Failed to return error');
    }).catch((e) => {
      expect(e).to.be.not.null;
      done();
    });
  });

});
