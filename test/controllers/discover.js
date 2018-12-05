/* global it, describe */
/* eslint no-unused-expressions: "off" */
/* eslint class-methods-use-this: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { DiscoverController } from '../../src/controllers/discover';
import { FsScanner } from '../../src/scanners/fs-scanner';

const chai = require('chai'),
  path = require('path'),
  sinon = require('sinon'),
  { expect } = chai,
  fs = require('fs');

describe('Discover Controller', () => {
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

    const controller = new DiscoverController({ fsScanner : new FsScanner(), kafka: new MockKafka() });
    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);

    expect(id).to.be.not.null;
    setTimeout(done, 20);
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

    const controller = new DiscoverController({ kafka: new MockKafka() });
    const stub = sinon.stub(controller.fsScanner, 'discover');
    stub.rejects(new Error('ERROR!'));

    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);
    expect(id).to.be.not.null;

    stub.restore();
    setTimeout(done, 20);
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

      const controller = new DiscoverController({ kafka : new MockKafka() });
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

      const controller = new DiscoverController({ kafka : new MockKafka() });
      const parentDir = path.join(__dirname, '/../../src');
      const id = controller.discover(parentDir);

      expect(id).to.be.not.null;
      setTimeout(done, 20);
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

      const controller = new DiscoverController({ kafka : new MockKafka() });
      const parentDir = path.join(__dirname, '/../../src');
      const id = controller.discover(parentDir);

      expect(id).to.be.not.null;
      setTimeout(done, 20);
    } catch (e) {
      done(e);
    }
  });
});
