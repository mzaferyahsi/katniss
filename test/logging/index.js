/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */
/* eslint class-methods-use-this: "off" */

import { expect } from 'chai';
import sinon from 'sinon';
import proxyrequire from 'proxyquire';
import Logstash from 'logstash-client';
import { LogLevel } from '../../src/logging';

describe('Logging', () => {
  let Logger;

  function MockLoggingClient(options) {
    this.options = options;
  };

  MockLoggingClient.prototype.connect = function connect() {
    console.log('Mock logger connected');
  }
  MockLoggingClient.prototype.send = function send(message) {
    console.log(this.options.format(message));
  };

  before(() => {
    Logger = proxyrequire('../../src/logging', {
      'logstash-client' : MockLoggingClient
    }).Logger;
  });

  it('should initialize logger', done => {
    const logger = Logger.getLogger('LoggingTest');
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
    const logger = Logger.getLogger('LoggingTest');

    logger.log(LogLevel.Info, 'Hello, World!');

    expect(logger).to.be.not.null;
    done();
  });

  it('should log message with JSON Object', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.log(LogLevel.Info, { message: 'Hello, World!', password: 'password' });

    expect(logger).to.be.not.null;
    done();
  });


  it('should log debug', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.logDebug('Hello, World!');

    expect(logger).to.be.not.null;
    done();
  });

  it('should log info', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.logInfo('Hello, World!');

    expect(logger).to.be.not.null;
    done();
  });

  it('should log warning', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.logWarning('Hello, World!');

    expect(logger).to.be.not.null;
    done();
  });

  it('should log error', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.logError('Hello, World!', new Error().stack);

    expect(logger).to.be.not.null;
    done();
  });

  it('should log fatal', done => {
    const logger = Logger.getLogger('LoggingTest');

    logger.logFatal('Hello, World!', new Error().stack);

    expect(logger).to.be.not.null;
    done();
  });

  it('should not log lover level', done => {
    const logger = Logger.getLogger('LoggingTest');
    logger.level = LogLevel.Error;

    logger.logDebug('Hello, World!', new Error().stack);

    expect(logger).to.be.not.null;
    done();
  });

});
