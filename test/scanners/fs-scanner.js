/* global it, describe */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import fs from 'fs';
import { FsScanner } from '../../src/scanners/fs-scanner';
import path from 'path';
import sinon from 'sinon';
import { MockLoggingClient } from '../mockloggingclient.js';

describe('Filesystem scanner', () => {
  
  it('should resolve path', (done) => {
    FsScanner.resolvePath('/etc/../etc').then((resolved) => {
      expect(resolved).to.be.eq('/etc');
      done();
    }).catch((e) => {
      done(e);
    });

  });

  it('should resolve home path', (done) => {

    FsScanner.resolvePath('~/').then((resolved) => {
      expect(resolved).to.be.eq(`${process.env.HOME}/`);
      done();
    }).catch((e) => {
      done(e);
    });
  });

  it('should fail discovering non-existent directory', (done) => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const nonExistentPath = '/i-do-not-exist';

    const result = scanner.discover(nonExistentPath);

    result.then(() => {
      done('Failed on test');
    }).catch((message) => {
      expect(message).to.be.not.null;
      done();
    });
  });

  it('should discover directory', (done) => {
    const scanner = new FsScanner({ fs: fs, logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const parentDir = path.join(__dirname, '/../../src');
    const result = scanner.discover(parentDir);

    result.then((files) => {
      expect(files).to.be.not.null;
      expect(files.length).to.be.gt(0);
      expect(files[0]).to.be.eq(parentDir);
      done();
    }).catch((message) => {
      done(message);
    });
  });

  it('should fail on unsupported promises on fs', done => {
    const unsupportedFs = {};
    try {
      const scanner = new FsScanner({ fs: unsupportedFs, logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
      done('Unable to fail!');
    } catch (e) {
      done();
    }
  });

  it('should fail reading directory contents', done => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const stub = sinon.stub(scanner.fsPromises, 'readdir');
    stub.rejects(new Error('ERROR!'));
    const result = scanner.discover(__dirname);

    result.then(() => {
      done('Unable to handle error');
    }).catch((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('Error');
      stub.restore();
      done();
    });
  });

  it('should fail discovering directories', done => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const stub = sinon.stub(scanner, 'discover');
    stub.rejects(new Error('ERROR!'));
    const result = scanner.discoverDirectory(path.join(__dirname, '../../src/scanners/'));

    result.then((files) => {
      done('Unable to handle error');
    }).catch((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('Error');
      stub.restore();
      done();
    });
  });

  it('should fail discovering directories from resolve error', done => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const stub = sinon.stub(FsScanner, 'resolvePath');
    stub.rejects(new Error('ERROR!'));
    const result = scanner.discover(path.join(__dirname, '../../src'));

    result.then(() => {
      done('Unable to handle error');
    }).catch((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('Error');
      stub.restore();
      done();
    });
  });

  it('should fail reading file', done => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const stub = sinon.stub(scanner.fsPromises, 'access');
    stub.rejects(new Error('ERROR!'));
    const result = scanner.discover(__dirname);

    result.then(() => {
      done('Unable to handle error');
    }).catch((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('Error');
      stub.restore();
      done();
    });
  });

  it('should fail reading statistics', done => {
    const scanner = new FsScanner({ logger : new MockLoggingClient({ className: 'FsScannerTest' }) });
    const stub = sinon.stub(scanner.fsPromises, 'lstat');
    stub.rejects(new Error('ERROR!'));
    const result = scanner.discover(__dirname);

    result.then(() => {
      done('Unable to handle error');
    }).catch((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('Error');
      stub.restore();
      done();
    });
  });
});
