/* jshint esversion: 6 */

import * as log4js from 'log4js';
import { DiscoverController } from '../discover/discover-controller';
import uuid from 'uuid/v4';
// import { FileInfoController } from '../analyse/file-info-controller';

export class DiscoveriesRoute {

  static getLogger() {
    /* istanbul ignore else */
    if(!DiscoveriesRoute.logger) {
      DiscoveriesRoute.logger = log4js.getLogger();
      DiscoveriesRoute.logger.addContext('source', 'DiscoveriesRoute');
    }

    return DiscoveriesRoute.logger;
  }

  static getDiscoverController() {
    /* istanbul ignore else */
    if(!this.discoverController)
      this.discoverController = new DiscoverController();

    // /* istanbul ignore else */
    // if(!this.fileInfoController)
    //   this.fileInfoController = new FileInfoController();

    return this.discoverController;
  }


  static configure(router) {
    router.post('/discoveries', this.handlePost.bind(this));
    this.getLogger().debug('scans configured.');
  }

  static handlePost (request, response) {
    if(!request.body || request.body && (!request.body.path || typeof request.body.path !== 'string')) {
      response.status(400)
        .json({
          code: 'DISCOVER40001',
          severity: 'error',
          message: 'Request body invalid'
        });
      return;
    }

    this.getDiscoverController().discover(request.body.path);

    response.status(201).json({
      id: uuid(),
      message: `${request.body.path} added to queue for discovery`
    });
  }
}
