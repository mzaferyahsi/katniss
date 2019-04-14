/* jshint esversion: 6 */

import express from 'express';
import config from './config/config';
import * as log4js from 'log4js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HeartBeatRoute } from './api/heartbeat';
import { DiscoveriesRoute } from './api/discoveries';

const app = express(),
  port = 8001 || process.env.PORT;

const logger = log4js.getLogger();
log4js.configure(config.log4js);
logger.addContext('source', 'app');

const router = express.Router();
HeartBeatRoute.configure(router);
DiscoveriesRoute.configure(router);

const corsConfig = config.cors || {
  'origin': '*',
  'headers': '*',
  'methods': '*'
};

const whitelist = corsConfig.origin;
const corsOptions = {
  origin: function (origin, callback) {
    const isWildcard = whitelist.indexOf('*') !== -1;
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    const isAllowed = isWildcard || originIsWhitelisted;
    callback(null, isAllowed);
  }
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, () => {
  logger.info(`App started at ${port}`);
});

require('events').EventEmitter.defaultMaxListeners = 0;
