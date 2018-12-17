/* jshint esversion: 6 */

import * as log4js from 'log4js';

export class HeartBeatRoute {

  constructor () {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'HeartBeatRoute');
  }

  handleGet (request, response) {
    response.status(200).json({
      message: 'OK'
    });
    this.logger.debug('Request handled with 200');
  }

  configure(router) {
    router.get('/heartbeat', this.handleGet.bind(this));
    this.logger.debug('Heartbeat configured.');
  }
}
