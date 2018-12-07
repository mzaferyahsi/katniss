/* jshint esversion: 6 */
/* eslint no-sync: "off" */
/* eslint array-callback-return: "off" */

import nodeFs from 'fs';
import path from 'path';
import { Logger } from '../logging';

export class FsScanner {
  constructor({ fs = null, logger = null } = {}) {
    /* istanbul ignore else */
    if (fs) {
      this.fs = fs;
      this.fsPromises = fs.promises;
    }
    else {
      this.fs = nodeFs;
      this.fsPromises = nodeFs.promises;
    }

    if (!this.fsPromises)
      throw new Error("Fs doesn't support promises. Please use NodeJS v10.0.0 at least.");

    /* istanbul ignore else */
    if (logger)
      this.logger = logger;
    else
      this.logger = Logger.getLogger({ className: 'FsScanner' });
  }

  static resolvePath(_path) {
    return new Promise((resolve, reject) => {
      try {
        if (_path[0] === '~')
          return resolve(path.join(process.env.HOME, _path.slice(1)));

        resolve(path.resolve(path.normalize(_path)));
      }
      catch (e) {
        /* istanbul ignore next */
        reject(e);
      }
    });
  }

  static pushArraysSync(source, items) {
    const toPush = source.concat.apply([], items);
    for (let i = 0, len = toPush.length; i < len; ++i)
      source.push(toPush[i]);
    return source;
  }

  discoverDirectory(filePath) {
    return new Promise((resolve, reject) => {
      this.fsPromises.readdir(filePath).then(subFiles => {
        const subFilePromisses = subFiles.map(subFile => {
          return new Promise((innerResolve, innerReject) => {
            const fullPath = path.join(filePath, subFile);
            this.discover(fullPath).then(subFileScanResults => {
              innerResolve(subFileScanResults);
            }).catch((err) => {
              this.logger.logError(err, new Error().stack);
              innerReject(err);
            });
          });
        });

        Promise.all(subFilePromisses)
          .then((results) => {
            let discovered = [];
            results.forEach(item => {
              discovered = FsScanner.pushArraysSync(discovered, item);
            });
            resolve(results);
          })
          .catch((e) => {
            this.logger.logError(e, new Error().stack);
            reject(e);
          });
      }).catch((err) => {
        this.logger.logError(err, new Error().stack);
        reject(err);
      });
    });
  }

  fsExists(filePath) {
    return new Promise((resolve, reject) => {
      this.fsPromises.access(filePath, this.fs.constants.R_OK).then(() => {
        resolve();
      }).catch((err) => {
        this.logger.logError(err, new Error().stack);
        return reject(err);
      });
    });
  }

  discover(directoryPath) {
    return new Promise((resolve, reject) => {
      FsScanner.resolvePath(directoryPath).then((resolvedPath) => {
        this.fsExists(resolvedPath).then(() => {
          this.fsPromises.lstat(resolvedPath).then(stats => {
            let _filePaths = [];
            _filePaths.push(resolvedPath);

            if (stats.isDirectory())
              this.discoverDirectory(resolvedPath).then(results => {
                _filePaths = FsScanner.pushArraysSync(_filePaths, results);
                resolve(_filePaths);
              }).catch((err) => {
                this.logger.logError(err, new Error().stack);
                reject(err);
              });
            else
              return resolve(_filePaths);

          }).catch((err) => {
            this.logger.logError(err, new Error().stack);
            reject(err);
          });
        }).catch((err) => {
          this.logger.logError(err, new Error().stack);
          reject(err);
        });
      }).catch((e) => {
        this.logger.logError(e, new Error().stack);
        reject(e);
      });

    });
  }
}
