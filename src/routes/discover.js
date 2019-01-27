/* jshint esversion: 6 */

import * as log4js from 'log4js';
import { DiscoverController } from '../controllers/discover';

export class DiscoverRoute {

  constructor () {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'DiscoverRoute');
    this.controller = new DiscoverController();
  }

  handlePost(request, response) {
    this.logger.debug(request.body);

    /* istanbul ignore else */
    if (!request.body.path)
      return response.status(400).json({
        code: 400,
        message: 'Invalid request body',
        severity: 'error'
      });

    this.controller.discover(request.body.path).then((id) => {
      response.json({
        id: id
      });
    });
  }

  configure(router) {
    router.post('/discover', this.handlePost.bind(this));
    this.logger.debug('Discover route configured.');
  }
}
