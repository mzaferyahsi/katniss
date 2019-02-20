/* jshint esversion: 6 */

import * as log4js from 'log4js';

export class HeartBeatRoute {

  static getLogger() {
    if(!HeartBeatRoute.logger) {
      HeartBeatRoute.logger = log4js.getLogger();
      HeartBeatRoute.logger.addContext('source', 'HeartBeatRoute');
    }

    return HeartBeatRoute.logger;
  }

  static configure(router) {
    router.get('/heartbeat', this.handleGet);
    this.getLogger().debug('Heartbeat configured.');
  }

  static handleGet (request, response) {
    response.status(200).json({
      message: 'OK'
    });
    this.getLogger().debug('Request handled with 200');
  }
}
