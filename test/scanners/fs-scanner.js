/* global it, describe */
/* eslint no-unused-expressions: "off" */

const chai = require('chai'),
  scanner = require('../../src/scanners/fs-scanner'),
  path = require('path'),
  { expect } = chai;

describe('Filesystem scanner', () => {
  it('should resolve path', (done) => {
    const resolvedPath = scanner.resolvePath('/etc/../etc');

    expect(resolvedPath).to.be.eq('/etc');
    done();
  });

  it('should resolve home path', (done) => {
    const resolvedPath = scanner.resolvePath('~/');

    expect(resolvedPath).to.be.eq(`${process.env.HOME}/`);
    done();
  });

  it('should fail discovering non-existent directory', (done) => {
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
});
