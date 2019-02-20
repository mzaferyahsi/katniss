/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';
import {TestLog4JConfig} from '../spec/log4js';
import {DiscoverController} from "./discover-controller";
import {Kafka} from "../kafka";

describe('Discover Controller tests', ()=> {

  let sandbox = null;

  before(() => {
    sandbox = sinon.createSandbox();
    TestLog4JConfig.configure('fatal');
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should initialize controller', done => {
    try {
      const controller = new DiscoverController();
      expect(controller).to.be.not.null;
      expect(controller).to.be.a('Object');
      controller.unschedule();
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should add items to queue', done => {
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

    const controller = new DiscoverController();
    expect(controller).to.be.not.null;
    expect(controller).to.be.a('Object');
    controller.unschedule();

    const stub = sandbox.stub(Kafka, 'getProducer');
    stub.resolves(new MockKafkaProducer());
    const queueSpy = sandbox.spy(controller.queue, 'add');

    controller.discoverExecutor(__filename);

    expect(queueSpy.called).to.be.true;
    done();
  });

  it('should dequeue', done => {
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

    const controller = new DiscoverController();
    expect(controller).to.be.not.null;
    expect(controller).to.be.a('Object');
    controller.unschedule();

    const stub = sandbox.stub(Kafka, 'getProducer');
    stub.resolves(new MockKafkaProducer());
    const queueSpy = sandbox.spy(controller.queue, 'remove');

    controller.discoverExecutor(__filename);
    controller.dequeue();

    expect(queueSpy.called).to.be.true;
    done();
  });

  it('should process queue', done => {
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

    const controller = new DiscoverController();
    expect(controller).to.be.not.null;
    expect(controller).to.be.a('Object');
    controller.unschedule();

    const stub = sandbox.stub(Kafka, 'getProducer');
    const mockKafkaProducer = new MockKafkaProducer()
    stub.resolves(mockKafkaProducer);
    const queueSpy = sandbox.spy(controller.queue, 'peek');
    const procuderSpy = sandbox.spy(mockKafkaProducer, 'send');

    controller.discoverExecutor(__filename);
    controller.processQueue();
    controller.unschedule();

    setTimeout(() => {
      expect(queueSpy.called).to.be.true;
          expect(procuderSpy.called).to.be.true;

          done();
    }, 21);
  });

  it('should handle error when getting kafka producer', done => {
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

    const controller = new DiscoverController();
    expect(controller).to.be.not.null;
    expect(controller).to.be.a('Object');
    controller.unschedule();

    const stub = sandbox.stub(Kafka, 'getProducer');
    const mockKafkaProducer = new MockKafkaProducer()
    stub.rejects(new Error('Error!'));
    const loggerSpy = sandbox.spy(controller.logger, 'error');

    controller.discoverExecutor(__filename);
    controller.processQueue();
    controller.unschedule();

    setTimeout(() => {
      expect(loggerSpy.called).to.be.true;
      done();  
    }, 21);
  });

  
  it('should handle when kafka producer gives error', done => {
    class MockKafkaProducer {
      on(action, callback) {
        if(action === 'error')
            callback(new Error('Error!'));
      }

      send (payload, callback) {
        setTimeout(() => {
          callback(null, payload);
        }, 10);
      }
    }

    const controller = new DiscoverController();
    expect(controller).to.be.not.null;
    expect(controller).to.be.a('Object');
    controller.unschedule();

    const stub = sandbox.stub(Kafka, 'getProducer');
    const mockKafkaProducer = new MockKafkaProducer()
    stub.resolves(mockKafkaProducer);
    const loggerSpy = sandbox.spy(controller.logger, 'error');

    controller.discoverExecutor(__filename);
    controller.processQueue();
    controller.unschedule();

    setTimeout(() => {
      expect(loggerSpy.called).to.be.true;
      done();  
    }, 21);
  });
});
