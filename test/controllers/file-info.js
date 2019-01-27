/* global it, describe, before, after, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-empty-function: "off" */
/* eslint class-methods-use-this: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import path from 'path';
import sinon from 'sinon';
import { FileInfoController } from '../../src/controllers/file-info';
import proxyquire from 'proxyquire';
import log4jsConfig from '../log4js';

describe('File Info Controller', () => {

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

  it('should initialize class', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;
    done();
  });

  it('should call handleConnect', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;

    const spy = sandbox.spy(controller.logger, 'debug');

    controller.handleConnect();

    expect(spy.calledOnce).to.be.ok;
    done();
  });

  it('should call handleMessage', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;

    const spy = sandbox.spy(controller.logger, 'debug');

    controller.handleMessage();

    expect(spy.calledOnce).to.be.ok;
    done();
  });

  it('should call handleClose', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;

    const spy = sandbox.spy(controller.logger, 'debug');

    controller.handleClose();

    expect(spy.calledOnce).to.be.ok;
    done();
  });

  it('should call handleClose with consumerGroup', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;
    const spy = sandbox.spy(controller.logger, 'debug');

    controller.consumerGroup = {
      close : () => {
      }
    };

    controller.handleClose();

    expect(spy.calledOnce).to.be.ok;

    done();
  });

  it('should call handleError', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;

    const spy = sandbox.spy(controller.logger, 'error');

    controller.handleError();

    expect(spy.calledOnce).to.be.ok;
    done();
  });

  it('should initialize', done => {
    const controller = new FileInfoController();
    expect(controller).to.be.not.null;

    const stubConsumerGroup = sandbox.stub(controller.kafka, 'getConsumerGroup');
    stubConsumerGroup.resolves({
      on: (action, callback) => {
        expect(action).to.be.not.null;
        expect(callback).to.be.a('function');
      },
      close: () => {

      }
    });

    const stubProducer = sandbox.stub(controller.kafka, 'getProducer');
    stubProducer.resolves({ });

    controller.initialize();
    done();

  });
});
