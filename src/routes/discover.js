/* jshint esversion: 6 */

import * as log4js from 'log4js';
import { DiscoverController } from '../controllers/discover';

let logger;
let controller;

export class DiscoverRoute {

  static get logger() {
    /* istanbul ignore else */
    if(!logger) {
      logger = log4js.getLogger();
      logger.addContext('source', 'DiscoverRoute');
    }

    return logger;
  }

  static get controller() {
    if(!controller)
      controller = new DiscoverController();

    return controller;
  }

  static handlePost(request, response) {
    DiscoverRoute.logger.debug(request.body);

    /* istanbul ignore else */
    if (!request.body.path)
      return response.status(400).json({
        code: 400,
        message: 'Invalid request body',
        severity: 'error'
      });

    DiscoverRoute.controller.discover(request.body.path).then((id) => {
      response.json({
        id: id
      });
    });
  }

  static configure(router) {
    router.post('/discover', DiscoverRoute.handlePost);
    DiscoverRoute.logger.debug('Discover route configured.');
  }
}
