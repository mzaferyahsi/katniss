/* global it, describe, before, after, beforeEach, afterEach */
/* eslint no-unused-expressions: "off" */
/* eslint no-unused-vars: "off" */
/* eslint sonarjs/no-identical-functions: "off" */
/* eslint sonarjs/no-duplicate-string: "off" */

import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';
import { DiscoverRoute } from '../../src/routes/discover';
import proxyquire from 'proxyquire';
import log4jsConfig from '../log4js';
import { KafkaClient, Producer } from 'kafka-node';
import { DiscoverController } from '../../src/controllers/discover';

describe('Discover Route tests', ()=> {

  let sandbox = null;
  let stubKafkaClient = null;

  before(() => {
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

  it('should configure router', done => {
    const router = express.Router();
    const spyRouter = sandbox.spy(router, 'post');

    DiscoverRoute.configure(router);
    expect(spyRouter.calledOnce).to.be.ok;

    done();
  });

  it('should test post discover endpoint', done => {
    const stubDiscoverController = sandbox.stub(DiscoverRoute.controller, 'discover');
    stubDiscoverController.callsFake((path) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('12345');
        }, 5);
      });
    });

    const response = express.response;

    const stubResponseStatus = sandbox.stub(response, 'status');
    stubResponseStatus.withArgs(200).returnsThis();
    stubResponseStatus.withArgs(400).returnsThis();
    const stubResponseJson = sandbox.stub(response, 'json');
    stubResponseJson.callsFake((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('object');
      done();
    });

    const request = {
      body: {
        path: __dirname
      }
    };

    DiscoverRoute.handlePost(request, response);
  });

  it('should fail post discover endpoint without path in the body', done => {
    const response = express.response;

    const stubResponseStatus = sandbox.stub(response, 'status');
    stubResponseStatus.withArgs(200).returnsThis();
    stubResponseStatus.withArgs(400).returnsThis();
    const stubResponseJson = sandbox.stub(response, 'json');
    stubResponseJson.callsFake((message) => {
      expect(message).to.be.not.null;
      expect(message).to.be.a('object');
      done();
    });

    const request = {
      body: {
      }
    };

    DiscoverRoute.handlePost(request, response);
  });
});
