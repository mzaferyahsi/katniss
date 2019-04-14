/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';
import { DiscoveriesRoute } from './discoveries';
import { TestLog4JConfig } from '../spec/log4js';
import {FileInfoController} from "../analyse/file-info-controller";

describe('Discoveries Route tests', ()=> {

  let sandbox = null;
  let fileInfoController;

  before(() => {
    sandbox = sinon.createSandbox();
    TestLog4JConfig.configure('fatal');
  });

  beforeEach(() => {
    fileInfoController = {};
    DiscoveriesRoute.fileInfoController = fileInfoController;
  });

  after(() => {
    sandbox.reset();
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should configure router for discoveries', done => {
    const router = express.Router();
    const spyRouter = sandbox.spy(router, 'post');

    DiscoveriesRoute.configure(router);
    expect(spyRouter.calledOnce).to.be.ok;

    done();
  });

  it('should test get heartbeat endpoint', done => {
    const response = express.response;

    const stubResponseStatus = sandbox.stub(response, 'status');
    stubResponseStatus.withArgs(201).returnsThis();
    const stubResponseJson = sandbox.stub(response, 'json');
    stubResponseJson.callsFake((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('object');
      done();
    });

    DiscoveriesRoute.handlePost({
      body: {
        path: __filename
      } }, response);
  });

  it('should fail scheduling a new discovery when no request body is provided', done => {
    const response = express.response;

    const stubResponseStatus = sandbox.stub(response, 'status');
    stubResponseStatus.withArgs(400).returnsThis();

    const stubResponseJson = sandbox.stub(response, 'json');
    stubResponseJson.callsFake((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('object');
      expect(message.code).to.be.eq('DISCOVER40001')
      done();
    });

    DiscoveriesRoute.handlePost({ }, response);
  });
});
