/* global it, describe, before, after, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint class-methods-use-this: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import path from 'path';
import sinon from 'sinon';
import { DiscoverController } from '../../src/controllers/discover';
import proxyquire from 'proxyquire';
import log4jsConfig from '../log4js';

describe('Discover Controller', () => {

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

  it('should initialize discover controller', done => {
    try {
      const controller = new DiscoverController();
      expect(controller).to.be.not.null;
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should discover directory', done => {
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

    class MockKafka {
      getProducer() {
        return new Promise((resolve) => {
          resolve(new MockKafkaProducer());
        });
      }
    }

    const TestDiscoverController = proxyquire('../../src/controllers/discover', {
      '../kafka': { Kafka: MockKafka }
    }).DiscoverController;

    const controller = new TestDiscoverController();
    const parentDir = path.join(__dirname, '/../../src');
    controller.discover(parentDir).then((id) => {
      expect(id).to.be.not.null;
      setTimeout(done, 10);
    });
  });


  it('should handle error on directory discovery', done => {
    class MockKafkaProducer {
      on (action, callback) {
        if(action === 'ready')
          setTimeout(callback, 10);
      }

      send (payload, callback) {
        setTimeout(() => {
          callback(null,payload);
        }, 10);
      }
    }

    class MockKafka {
      getProducer() {
        return new Promise((resolve) => {
          resolve(new MockKafkaProducer());
        });
      }
    }

    const TestDiscoverController = proxyquire('../../src/controllers/discover', {
      '../kafka': { Kafka: MockKafka }
    }).DiscoverController;

    const controller = new TestDiscoverController();
    const stub = sinon.stub(controller.fsScanner, 'discover');
    stub.rejects(new Error('ERROR!'));

    const parentDir = path.join(__dirname, '/../../src');
    controller.discover(parentDir).then((id) => {
      expect(id).to.be.not.null;

      stub.restore();
      setTimeout(done, 20);
    });
  });

  it('should use provided Kafka class', (done) => {

    try {
      class MockKafkaProducer {
        on (action, callback) {
          if(action === 'ready')
            setTimeout(callback, 10);
        }

        send (payload, callback) {
          setTimeout(() => {
            callback(null,payload);
          }, 10);
        }
      }

      class MockKafka {
        getProducer() {
          return new Promise((resolve) => {
            resolve(new MockKafkaProducer());
          });
        }
      }

      const TestDiscoverController = proxyquire('../../src/controllers/discover', {
        '../kafka': { Kafka: MockKafka }
      }).DiscoverController;

      const controller = new TestDiscoverController();

      expect(controller).to.be.not.null;
      setTimeout(done, 20);
    } catch (e) {
      done(e);
    }
  });

  it('should handle error when pushing to kafka', (done) => {

    try {
      class MockKafkaProducer {
        on (action, callback) {
          if(action === 'ready')
            setTimeout(callback, 10);
          else
            this.errorCallback = callback;
        }

        send () {
          setTimeout(() => {
            this.errorCallback('ERROR!');
          }, 10);
        }
      }

      class MockKafka {
        getProducer() {
          return new Promise((resolve) => {
            resolve(new MockKafkaProducer());
          });
        }
      }

      const TestDiscoverController = proxyquire('../../src/controllers/discover', {
        '../kafka': { Kafka: MockKafka }
      }).DiscoverController;

      const controller = new TestDiscoverController();
      const parentDir = path.join(__dirname, '/../../src');
      controller.discover(parentDir).then((id) => {
        expect(id).to.be.not.null;
        setTimeout(done, 20);
      });
    } catch (e) {
      done(e);
    }
  });

  it('should handle error when pushing to kafka', (done) => {

    try {
      class MockKafka {
        getProducer() {
          return new Promise((resolve, reject) => {
            reject('ERROR!');
          });
        }
      }

      const TestDiscoverController = proxyquire('../../src/controllers/discover', {
        '../kafka': { Kafka: MockKafka }
      }).DiscoverController;

      const controller = new TestDiscoverController();

      const parentDir = path.join(__dirname, '/../../src');
      controller.discover(parentDir).then((id)=>{
        expect(id).to.be.not.null;
        setTimeout(done, 20);
      });
    } catch (e) {
      done(e);
    }
  });
});
