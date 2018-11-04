/* jshint esversion: 6 */

import { FsScanner } from '../scanners/fs-scanner';
import uuid from 'uuid/v4';

export class DiscoverController {
  constructor ({ fsScanner = null } = {}) {
    /* istanbul ignore else */
    if(fsScanner)
      this.fsScanner = fsScanner;
    else
      this.fsScanner = new FsScanner();
  }

  discover (path) {
    const id = uuid();

    this.fsScanner.discover(path).then((paths) => {
      console.log(JSON.stringify(paths));
      //TODO: Push paths to Kafka
    }).catch((error) => {
      console.log(error);
      //TODO: Push errors to Kafka
    });

    return id;
  }
}
