/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';
import { HeartBeatRoute } from './heartbeat';
import {TestLog4JConfig} from '../spec/log4js';

describe('Heartbeat Route tests', ()=> {

  let sandbox = null;

  before(() => {
    sandbox = sinon.createSandbox();
    TestLog4JConfig.configure('fatal');
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should configure router for heartbeat', done => {
    const router = express.Router();
    const spyRouter = sandbox.spy(router, 'get');

    HeartBeatRoute.configure(router);
    expect(spyRouter.calledOnce).to.be.ok;

    done();
  });

  it('should test get heartbeat endpoint', done => {
    const response = express.response;

    const stubResponseStatus = sandbox.stub(response, 'status');
    stubResponseStatus.withArgs(200).returnsThis();
    const stubResponseJson = sandbox.stub(response, 'json');
    stubResponseJson.callsFake((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('object');
      done();
    });

    HeartBeatRoute.handleGet({}, response);
  });
});
