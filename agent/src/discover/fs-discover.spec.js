/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { FSDiscover} from "./fs-discover";
import { expect } from 'chai';
import config from '../config/config';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { TestLog4JConfig } from '../spec/log4js';
import {FSUtility} from "../fs/utility";

describe('FSDiscover', () => {

  let sandbox = null;

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

  it('should initialize FSDiscover', done => {
    try {
      const fsDiscover = new FSDiscover((path) => { });

      expect(fsDiscover).to.be.not.null;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should fail initializing FSDiscover', done => {
    try {
      new FSDiscover();
      done('Unable to fail');
    } catch(e) {
      expect(e).to.be.not.null;
      expect(e).to.be.a('Error');
      done();
    }
  });

  it('should discover current file', done => {
    try {
      const fsDiscover = new FSDiscover((path) => {
        expect(path).to.be.eq(__filename);
        done();
      });

      fsDiscover.discover(__filename);
    } catch(e) {
      done(e);
    }
  });

  it('should discover current file twice', done => {
    try {
      let count = 0;
      const fsDiscover = new FSDiscover((path) => {
        count++;
        expect(path).to.be.eq(__filename);

        if(count > 1)
          done();

      });

      fsDiscover.discover(__filename);
      fsDiscover.discover(__filename);
    } catch(e) {
      done(e);
    }
  });

  it('should fail discovering file', done => {
    const stub = sandbox.stub(FSUtility, 'resolvePath');
    stub.rejects(new Error('ERROR!!'));

    try {
      const fsDiscover = new FSDiscover((path) => {
        expect(path).to.be.not.null;
      });

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
      const fsDiscover = new FSDiscover((path) => {
        expect(path).to.be.not.null;
      });

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

      const fsDiscover = new FSDiscover((path) => {
        expect(path).to.be.not.null;
      });

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

      const fsDiscover = new FSDiscover((path) => {
        expect(path).to.be.not.null;
      });

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
