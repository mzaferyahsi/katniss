/* eslint-disable sonarjs/no-duplicate-string */
/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { Kafka } from './index';
import { expect } from 'chai';
import config from '../config/config';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { TestLog4JConfig } from '../spec/log4js';

describe('Kafka', () => {

  let sandbox = null;
  const failedToReturnError = 'Failed to return error!';

  before(() => {
    TestLog4JConfig.configure('fatal');
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
    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: Stub
      }
    }).Kafka;

    _Kafka.getClient().then((client) => {
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: Stub
      }
    }).Kafka;

    _Kafka.getClient().then(() => {
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    _Kafka.getConsumer({}, {}).then((consumer) => {
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    _Kafka.getConsumer({}, {}).then((consumer) => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Consumer: StubConsumer
      }
    }).Kafka;

    _Kafka.getConsumer({}, {}).then((consumer) => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    _Kafka.getProducer({}, {}).then((producer) => {
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    _Kafka.getProducer({}, {}).then((producer) => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        KafkaClient: StubClient,
        Producer: StubProducer
      }
    }).Kafka;

    _Kafka.getProducer({}, {}).then((producer) => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup('id', ['topic'], {}).then(consumerGroup => {

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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup('id',['topic'], {}).then(consumerGroup => {

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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup(undefined, ['topic'] ).then(consumerGroup => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup('id', ['topic'], { groupId: 'differentId' }).then(consumerGroup => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup('a' ).then(consumerGroup => {
      done(failedToReturnError);
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

    const _Kafka = proxyquire('./index', {
      'kafka-node': {
        ConsumerGroup: StubConsumerGroup
      }
    }).Kafka;

    _Kafka.getConsumerGroup('a', ['topic']).then(consumerGroup => {
      done(failedToReturnError);
    }).catch((e) => {
      expect(e).to.be.not.null;
      done();
    });
  });

});
