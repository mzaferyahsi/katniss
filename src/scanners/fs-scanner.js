/* jshint esversion: 6 */
/* eslint no-sync: "off" */
/* eslint array-callback-return: "off" */

import nodeFs from 'fs';
import path from 'path';

export class FsScanner {
  constructor({ fs = null } = {}) {
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
  }

  static resolvePath(_path) {
    return new Promise((resolve, reject) => {
      try {
        if (_path[0] === '~')
          return resolve(path.join(process.env.HOME, _path.slice(1)));

        resolve(path.resolve(path.normalize(_path)));
      } catch (e) {
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
            reject(e);
          });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  fsExists(filePath) {
    return new Promise((resolve, reject) => {
      this.fsPromises.access(filePath, this.fs.constants.R_OK).then(() => {
        resolve();
      }).catch((err) => {
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
                reject(err);
              });
            else
              return resolve(_filePaths);

          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((e) => {
        reject(e);
      });

    });
  }
}
