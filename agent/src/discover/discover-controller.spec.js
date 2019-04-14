/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { DiscoverController } from './discover-controller';
import { expect } from 'chai';
import config from '../config/config';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { TestLog4JConfig } from '../spec/log4js';
import { FSUtility } from '../fs/utility';
import { GenericKafkaProducer } from '../kafka/generic-producer';

describe('DiscoverController', () => {

  let sandbox = null;
  let addStub = null;

  before(() => {
    TestLog4JConfig.configure('fatal');
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    addStub = sandbox.stub(GenericKafkaProducer, 'add');
    addStub.resolves(undefined);
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should initialize DiscoverController', done => {
    try {
      const fsDiscover = new DiscoverController();

      expect(fsDiscover).to.be.not.null;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should discover current file', done => {
    try {
      const fsDiscover = new DiscoverController();

      fsDiscover.discover(__filename);
      setTimeout(() => {
        expect(addStub.called).to.be.true;
        done();
      },30);
    } catch(e) {
      done(e);
    }
  });

  it('should discover current file twice', done => {
    try {
      const fsDiscover = new DiscoverController();

      fsDiscover.discover(__filename);
      fsDiscover.discover(__filename);

      setTimeout(() => {
        expect(addStub.called).to.be.true;
        expect(addStub.calledTwice).to.be.true;
        done();
      },30);

    } catch(e) {
      done(e);
    }
  });

  it('should fail discovering file', done => {
    const stub = sandbox.stub(FSUtility, 'resolvePath');
    stub.rejects(new Error('ERROR!!'));

    try {
      const fsDiscover = new DiscoverController();

      const spy = sandbox.spy(fsDiscover.logger, 'error');

      fsDiscover.discover(__filename);
      setTimeout(() => {
        expect(spy.called).to.be.true;
        done();
      }, 10);
    } catch (e) {
      done(e);
    }
  });

  it('should fail discovering file when processing queue', done => {
    const stub = sandbox.stub(FSUtility, 'isDirectory');
    stub.rejects(new Error('ERROR!!'));

    try {
      const fsDiscover = new DiscoverController();

      const spy = sandbox.spy(fsDiscover.logger, 'error');

      fsDiscover.discover(__filename);
      setTimeout(() => {
        expect(spy.called).to.be.true;
        done();
      }, 10);
    } catch (e) {
      done(e);
    }
  });

  it('should discover current directory', done => {
    try {

      const fsDiscover = new DiscoverController();

      const spy = sandbox.spy(fsDiscover.logger, 'error');

      fsDiscover.discover(__dirname);

      setTimeout(() => {
        expect(spy.called).to.be.false;

        done();
      }, 10);

    } catch(e) {
      done(e);
    }

  });

  it('should fail discovering current directory', done => {
    const stub = sandbox.stub(FSUtility, 'readDir');
    stub.rejects(new Error('ERROR!!'));

    try {

      const fsDiscover = new DiscoverController();

      const spy = sandbox.spy(fsDiscover.logger, 'error');

      fsDiscover.discover(__dirname);

      setTimeout(() => {
        expect(spy.called).to.be.true;

        done();
      }, 10);

    } catch(e) {
      done(e);
    }

  });
});
