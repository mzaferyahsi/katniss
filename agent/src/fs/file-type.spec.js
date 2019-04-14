/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import sinon from 'sinon';
import { expect } from 'chai';
import { TestLog4JConfig } from '../spec/log4js';
import { FileType } from './file-type';
import nodePath from 'path';
import proxyquire from 'proxyquire';

describe('FileType', () => {

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

  it('should get file type for current file', done => {
    FileType
      .get(__filename)
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('js');
        done();
      })
      .catch(done);
  });

  it('should get file type for a NEF file', done => {
    FileType
      .get('src/spec/raw.nef')
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('nef');
        done();
      })
      .catch(done);
  });

  it('should get file type for a text file without extension', done => {
    FileType
      .get(nodePath.resolve('src/spec/text'))
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('');
        done();
      })
      .catch(done);
  });


  it('should handle get file type for an SVG file errors', done => {
    const stub = sandbox.stub();
    stub.rejects(new Error('Error!'));
    const ProxyFileType = proxyquire('./file-type', {
      'is-svg': stub
    }).FileType;

    ProxyFileType
      .get(nodePath.resolve('src/spec/img.svg'))
      .then(() => {
        done('unable to fail');
      })
      .catch((e) => {
        expect(e).to.be.a('Error');
        expect(e.message).to.be.eq('Error!');
        done();
      });
  });

  it('should get file type for an SVG file', done => {
    FileType
      .get(nodePath.resolve('src/spec/img.svg'))
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('svg');
        done();
      })
      .catch(done);
  });

  it('should get file type for an SVG file with different content', done => {
    FileType
      .get(nodePath.resolve('src/spec/not-img.svg'))
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('svg');
        expect(result.mime).to.be.eq('unknown');
        done();
      })
      .catch(done);
  });

  it('should get file type for an JPEG file', done => {
    FileType
      .get(nodePath.resolve('src/spec/img.jpg'))
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('jpg');
        done();
      })
      .catch(done);
  });

  it('should get file type for an JSON file', done => {
    FileType
      .get(nodePath.resolve('src/spec/sample.json'))
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.ext).to.be.eq('json');
        done();
      })
      .catch(done);
  });

  it('should get file type for a directory', done => {
    FileType
      .get(__dirname)
      .then(result => {
        expect(result).to.be.not.null;
        expect(result).to.be.a('Object');
        expect(result.mime).to.be.eq('directory');
        done();
      })
      .catch(done);
  });
});
