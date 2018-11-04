/* global it, describe */
/* eslint no-unused-expressions: "off" */

import { DiscoverController } from '../../src/controllers/discover';
import { FsScanner } from '../../src/scanners/fs-scanner';

const chai = require('chai'),
  path = require('path'),
  sinon = require('sinon'),
  { expect } = chai,
  fs = require('fs');

describe('Discover Controller', () => {
  it('should discover directory', done => {
    const controller = new DiscoverController({ fsScanner : new FsScanner() });
    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);

    expect(id).to.be.not.null;
    done();
  });

  it('should handle error on directory discovery', done => {
    const controller = new DiscoverController();
    const stub = sinon.stub(controller.fsScanner, 'discover');
    stub.rejects(new Error('ERROR!'));

    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);
    expect(id).to.be.not.null;

    stub.restore();
    done();
  });
});
