/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { FSUtility } from './utility';
import nodeFs from 'fs';
import nodePath from 'path';
import { expect } from 'chai';
import config from '../config/config';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { TestLog4JConfig } from '../spec/log4js';

describe('FSUtility', () => {

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

  it('should resolve home path', done => {
    FSUtility
      .resolvePath('~/')
      .then(resolved => {
        expect(resolved).to.be.eq(nodePath.join(process.env.HOME, '~/'.slice(1)));
        done();
      })
      .catch(e => done(e));
  });

  it('should resolve current path', done => {
    FSUtility
      .resolvePath('/etc/../etc')
      .then((resolved) => {
        expect(resolved).to.be.eq('/etc');
        done();
      })
      .catch(e => done(e));
  });

  it('should check if current file exists', done => {
    FSUtility
      .exists(__filename)
      .then(path => {
        expect(path).to.be.eq(__filename);
        done();
      })
      .catch(e => done(e));
  });

  it('should check if non existent file exists', done => {
    FSUtility
      .exists(`${__filename}-not-here`)
      .then(path => done('Unable to fail'))
      .catch(e => {
        expect(e).to.be.not.null;
        done();
      });
  });

  it('should check if current directory is directory', done => {
    FSUtility
      .isDirectory(__dirname)
      .then(result => {
        expect(result).to.be.true;
        done();
      })
      .catch(e => done(e));
  });

  it('should check if current file is directory', done => {
    FSUtility
      .isDirectory(__filename)
      .then(result => {
        expect(result).to.be.false;
        done();
      })
      .catch(e => done(e));
  });

  it('should read files under directory', done => {
    FSUtility
      .readDir(__dirname)
      .then(paths => {
        expect(paths.length).to.be.gt(0);
        done();
      })
      .catch(e => done(e));
  });

  it('should fail checking if current file is directory', done => {
    const stub = sandbox.stub(nodeFs.promises, 'lstat');
    stub.rejects(new Error('ERROR!'));

    FSUtility
      .isDirectory(__filename)
      .then(() => done('Unable to fail'))
      .catch(e => {
        expect(e).to.be.not.null;
        expect(e).to.be.a('Error');
        done();
      });
  });

  it('should fail reading files under directory', done => {
    const stub = sandbox.stub(nodeFs.promises, 'readdir');
    stub.rejects(new Error('ERROR!'));

    FSUtility
      .readDir(__dirname)
      .then(() => done('Unable to fail'))
      .catch(e => {
        expect(e).to.be.not.null;
        expect(e).to.be.a('Error');
        done();
      });
  });

});
