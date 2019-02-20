/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint no-empty-function: "off" */
/* eslint no-useless-constructor: "off" */
/* eslint sonarjs/no-identical-functions: "off" */

import { Queue } from './queue';
import { expect } from 'chai';
import sinon from 'sinon';
import { TestLog4JConfig } from '../spec/log4js';

describe('Queue', () => {

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

  it('should initialize Queue', done => {
    try {
      const q = new Queue();
      expect(q).to.be.not.null;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should add values to queue', done => {
    try {
      const q = new Queue();
      expect(q).to.be.not.null;
      q.add(1);
      expect(q.peek()).to.be.eq(1);
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should peek next value in the queue', done => {
    try {
      const q = new Queue();
      expect(q).to.be.not.null;
      q.add(1);
      expect(q.peek()).to.be.eq(1);
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should peek next value in the empty queue', done => {
    try {
      const q = new Queue();
      expect(q).to.be.not.null;
      expect(q.peek()).to.be.null;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should remove the next element from the queue', done => {
    try {
      const q = new Queue();
      q.add(1);
      q.add(2);
      expect(q).to.be.not.null;
      expect(q.peek()).to.be.eq(1);
      expect(q.remove()).to.be.eq(1);
      expect(q.peek()).to.be.eq(2);
      done();
    } catch(e) {
      done(e);
    }
  });

  it('should get the length of the queue', done => {
    try {
      const q = new Queue();
      q.add(1);
      q.add(2);
      expect(q).to.be.not.null;
      expect(q.peek()).to.be.eq(1);
      expect(q.length()).to.be.eq(2);
      done();
    } catch(e) {
      done(e);
    }
  });
});
