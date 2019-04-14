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
import { GenericKafkaProducer } from './generic-producer';

describe('GenericKafkaProducer', () => {

  class MockKafkaProducer {
    on (action, callback) {
      if(action === 'ready')
        setTimeout(callback, 10);

    }

    send (payload, callback) {
      setTimeout(() => {
        callback(null, payload);
      }, 10);
    }
  }
  const mockKafkaProducer = new MockKafkaProducer();

  let sandbox = null;
  const failedToReturnError = 'Failed to return error!';

  before(() => {
    TestLog4JConfig.configure('debug');
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    const stub = sandbox.stub(Kafka, 'getProducer');
    stub.resolves(mockKafkaProducer);
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should add messages to queue', done => {
    const msg = {
      topic: config.kafka.topics.discoveredFiles,
      messages: __filename
    };

    GenericKafkaProducer
      .add(msg)
      .then(done)
      .catch(done)
      .finally(() => {
        GenericKafkaProducer.unschedule();
      })
  });

  it('should fail adding invalid messages to queue', done => {
    const msg = {
      messages: __filename
    };

    GenericKafkaProducer
      .add(msg)
      .then(() => {
        done(failedToReturnError);
      })
      .catch((e) => {
        expect(e).to.be.a('error');
        done();
      })
      .finally(() => {
        GenericKafkaProducer.unschedule();
      });
  });

  it('should process and publish messages in the queue', done => {
    const msg = {
      topic: config.kafka.topics.discoveredFiles,
      messages: __filename
    };

    GenericKafkaProducer.interval = 5;

    const scheduleSpy = sandbox.spy(GenericKafkaProducer, 'schedule');
    const dequeueSpy = sandbox.spy(GenericKafkaProducer, 'dequeue');
    const processSpy = sandbox.spy(GenericKafkaProducer, 'process');
    const publishSpy = sandbox.spy(GenericKafkaProducer, 'publish');
    const kafkaSpy = sandbox.spy(mockKafkaProducer, 'on');

    GenericKafkaProducer
      .add(msg)
      .then(() => {
        setTimeout(() => {
          GenericKafkaProducer.unschedule();
          expect(GenericKafkaProducer.interval).to.be.eq(5);
          expect(scheduleSpy.called).to.be.true;
          expect(dequeueSpy.called).to.be.true;
          expect(processSpy.called).to.be.true;
          expect(publishSpy.called).to.be.true;
          expect(kafkaSpy.called).to.be.true;
          done();
        }, 50);
      })
      .catch((e) => {
        GenericKafkaProducer.unschedule();
        done(e);
      });
  });

  it('should handle error when adding to the queue', done => {
    const stub = sandbox.stub(GenericKafkaProducer.queue, 'add');
    stub.throws(new Error('ERROR!'));

    const logger = GenericKafkaProducer.getLogger();

    const loggerSpy = sandbox.spy(logger, 'error');

    const msg = {
      topic: config.kafka.topics.discoveredFiles,
      messages: __filename
    };

    GenericKafkaProducer
      .add(msg)
      .then(() => {
        done('Failed to return error!');
      })
      .catch((e) => {
        expect(e).to.be.not.null;
        expect(e).to.be.a('Error');
        expect(loggerSpy.called).to.be.true;
        done();
      })
      .finally(() => {
        GenericKafkaProducer.unschedule();
      });
  });

  it('should handle error when getting kafka producer', done => {
    sandbox.restore();
    sandbox.reset();

    const stub = sandbox.stub(Kafka, 'getProducer');
    stub.rejects(new Error('ERROR!'));

    const addSpy = sandbox.spy(GenericKafkaProducer.queue, 'add');

    const logger = GenericKafkaProducer.getLogger();

    const loggerSpy = sandbox.spy(logger, 'error');

    const msg = {
      topic: config.kafka.topics.discoveredFiles,
      messages: __filename
    };

    GenericKafkaProducer.publish([msg]);
    setTimeout(() => {
      GenericKafkaProducer.unschedule();
      expect(addSpy.called).to.be.true;
      expect(loggerSpy.called).to.be.true;
      done();
    }, 30);
  });

  it('should do nothing when no messages are to be published', done => {
    sandbox.restore();
    sandbox.reset();

    const spy = sandbox.spy(Kafka, 'getProducer');

    GenericKafkaProducer.publish([]);
    setTimeout(() => {
      expect(spy.called).to.be.false;
      done();
    }, 30);
  });
});
