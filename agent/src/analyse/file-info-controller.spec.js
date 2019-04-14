/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */
/* eslint class-methods-use-this: "off" */
/* eslint no-empty-function: "off" */


import { expect } from 'chai';
import sinon from 'sinon';
import { TestLog4JConfig } from '../spec/log4js';
import { FileInfoController } from './file-info-controller';
import { Kafka } from '../kafka';
import {GenericKafkaProducer} from "../kafka/generic-producer";

describe('File Info Controller tests', () => {

  let sandbox = null;
  const context = [];
  let genericKafkaProducerAddStub;

  before(() => {
    sandbox = sinon.createSandbox();
    TestLog4JConfig.configure('fatal');
  });

  beforeEach(() => {
    class MockKafkaProducer {
      on(action, callback) {
        if(action === 'ready')
          setTimeout(callback, 10);

      }

      send (payload, callback) {
        setTimeout(() => {
          callback(null, payload);
        }, 10);
      }
    }

    const stub = sandbox.stub(Kafka, 'getProducer');
    const mockKafkaProducer = new MockKafkaProducer();
    stub.resolves(mockKafkaProducer);

    genericKafkaProducerAddStub = sandbox.stub(GenericKafkaProducer, 'add');
    genericKafkaProducerAddStub.resolves(undefined);
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();

    while(context.length > 0) {
      const controller = context.pop();
      controller.queue.clear();
      controller.unschedule();
    }
  });

  it('should initialize controller', done => {
    const controller = new FileInfoController({ initialize: false });
    context.push(controller);

    expect(controller).to.be.not.null;
    controller.unschedule();
    done();
  });

  it('should handle error when getting kafka consumer group ', done => {
    const getConsumerGroupStub = sandbox.stub(Kafka, 'getConsumerGroup');
    getConsumerGroupStub.rejects(new Error('Error!'));
    const controller = new FileInfoController({ initialize: false });
    expect(controller).to.be.not.null;
    const spyError = sandbox.spy(controller.logger, 'error');
    controller.unschedule();
    context.push(controller);

    controller.initialize()
      .then(() => {
        done('Unable to fail!');
      })
      .catch(() => {
        expect(spyError.calledOnce).to.be.true;
        done();
      });
  });

  it('should pause kafka consumer', done => {
    class MockKafkaConsumerGroup {
      on(action, callback) {
        if (action === 'message')
          callback({ value: __filename });
      }

      pause() {
      }
      isPaused() {
        return false;
      }
    }
    const mockConsumerGroup = new MockKafkaConsumerGroup();
    const spyPaused = sandbox.spy(mockConsumerGroup, 'pause');

    const getConsumerGroupStub = sandbox.stub(Kafka, 'getConsumerGroup');
    getConsumerGroupStub.resolves(mockConsumerGroup);
    const controller = new FileInfoController({ initialize: false });
    controller.unschedule();
    context.push(controller);

    expect(controller).to.be.not.null;
    controller.initialize()
      .then(() => {
        setTimeout(() => {
          expect(spyPaused.calledOnce).to.be.true;
          done();
        }, 10)
      })
      .catch(done);
  });


  it('should pause kafka consumer and resume afterwards', done => {
    class MockKafkaConsumerGroup {
      on(action, callback) {
        if (action === 'message')
          callback({ value: __filename });
      }
      pause() {
      }

      isPaused() {
        return true;
      }
      resume() {

      }
    }
    const mockConsumerGroup = new MockKafkaConsumerGroup();
    const spyPaused = sandbox.spy(mockConsumerGroup, 'pause');
    const spyResume = sandbox.spy(mockConsumerGroup, 'resume');

    const getConsumerGroupStub = sandbox.stub(Kafka, 'getConsumerGroup');
    getConsumerGroupStub.resolves(mockConsumerGroup);
    const controller = new FileInfoController({ initialize: false });
    controller.unschedule();
    context.push(controller);

    expect(controller).to.be.not.null;

    controller.initialize()
      .then(() => {
        setTimeout(() => {
          controller.unschedule();

          expect(spyPaused.calledOnce).to.be.true;
          expect(spyResume.calledOnce).to.be.true;
          done();
        }, 10);
      })
      .catch(done);
  });

  it('should initialize controller when creating new instance', done => {
    class MockKafkaConsumerGroup {
      on(action, callback) {
        if (action === 'message')
          callback({ value: __filename });
      }
      pause() {
      }

      isPaused() {
        return true;
      }
      resume() {

      }
    }
    const mockConsumerGroup = new MockKafkaConsumerGroup();
    const getConsumerGroupStub = sandbox.stub(Kafka, 'getConsumerGroup');
    getConsumerGroupStub.resolves(mockConsumerGroup);

    const controller = new FileInfoController();
    controller.unschedule();
    context.push(controller);

    expect(controller).to.be.not.null;
    done();
  });

  it('should handle getting error when reading message from kafka', done => {
    class MockKafkaConsumerGroup {
      on(action, callback) {
        if (action === 'error')
          callback(new Error('Error!'));
      }
    }
    const mockConsumerGroup = new MockKafkaConsumerGroup();

    const getConsumerGroupStub = sandbox.stub(Kafka, 'getConsumerGroup');
    getConsumerGroupStub.resolves(mockConsumerGroup);
    const controller = new FileInfoController({ initialize: false });
    expect(controller).to.be.not.null;
    controller.unschedule();
    context.push(controller);

    const spy = sandbox.spy(controller, 'handleKafkaError');
    controller.initialize();

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
      done();
    }, 10);
  });

  it('should handle kafka messages', done => {
    class MockKafkaConsumer {
      pause() {
        this.paused = true;
      }
      isPaused() {
        return this.paused;
      }
      resume() {
        if (this.isPaused())
          this.paused = !this.paused;
      }
    }

    const controller = new FileInfoController({ initialize: false });
    expect(controller).to.be.not.null;
    controller.unschedule();
    context.push(controller);

    const spyGetFileInfo = sandbox.spy(controller, 'getFileInfo');
    controller.consumer = new MockKafkaConsumer();
    controller.handleKafkaMessage({ value: __filename });

    expect(spyGetFileInfo.calledOnce).to.be.true;
    done();
  });
});
