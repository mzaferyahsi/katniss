/* global it, describe */
/* eslint no-unused-expressions: "off" */

const chai = require('chai'),
  controller = require('../../src/controllers/discover'),
  path = require('path'),
  sinon = require('sinon'),
  { expect } = chai;

describe('Discover Controller', () => {
  it('should discover directory', done => {
    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);

    expect(id).to.be.not.null;
    done();
  });

  it('should handle error on directory discovery', done => {
    const stub = sinon.stub(controller.fsScanner, 'discover');
    stub.rejects(new Error('ERROR!'));

    const parentDir = path.join(__dirname, '/../../src');
    const id = controller.discover(parentDir);
    expect(id).to.be.not.null;

    stub.restore();
    done();
  });
});
