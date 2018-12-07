/* global it, describe */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */
/* eslint class-methods-use-this: "off" */

import { expect } from 'chai';
import { Logger } from '../../src/logging';

describe('Logging', () => {
  class MockLoggingClient {
    constructor ({ className= null } = {}) {
      this.className = className;
    }

    send (message) {
      console.log(message);
    }
  }

  it('should initialize logger', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });
    expect(logger).to.be.not.null;
    done();
  });

  it('should throw error when getting logger without class name ', done => {
    try {
      Logger.getLogger();
      done('Unable to throw error!');
    } catch (e) {
      done();
    }
  });

  it('should log message', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });

    logger.log('info', 'Hello, World!');

    expect(logger).to.be.not.null;
    setTimeout(done, 10);
  });
  
  it('should log message with JSON Object', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });

    logger.log('info', { message: 'Hello, World!' });

    expect(logger).to.be.not.null;
    setTimeout(done, 10);
  });

  it('should log info', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });

    logger.logInfo('Hello, World!');

    expect(logger).to.be.not.null;
    setTimeout(done, 10);
  });

  it('should log warning', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });

    logger.logWarning('Hello, World!');

    expect(logger).to.be.not.null;
    setTimeout(done, 10);
  });

  it('should log error', done => {
    const logger = Logger.getLogger({ className: 'LoggingTest', client: MockLoggingClient });

    logger.logError('Hello, World!', new Error().stack);

    expect(logger).to.be.not.null;
    setTimeout(done, 10);
  });
});
