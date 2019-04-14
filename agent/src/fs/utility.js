/* jshint esversion: 6 */

import nodeFs from 'fs';
import nodePath from 'path';

export class FSUtility {

  static resolvePath(path) {
    return new Promise((resolve, reject) => {
      try {
        if (path[0] === '~')
          return resolve(nodePath.join(process.env.HOME, path.slice(1)));

        resolve(nodePath.resolve(nodePath.normalize(path)));
      }
      catch (e) {
        /* istanbul ignore next */
        reject(e);
      }
    });
  }

  static exists(path) {
    return new Promise((resolve, reject) => {
      /* istanbul ignore else */
      if(nodeFs.promises.access)
        nodeFs
          .promises
          .access(path, nodeFs.constants.R_OK)
          .then(() => {
            resolve(path);
          })
          .catch((e) => reject(e));
      else
        nodeFs
          .access(path, nodeFs.constants.R_OK, (e) => {
            if(e)
              return reject(e);
            resolve(path);
          });
    });
  }

  static isDirectory(path) {
    return new Promise((resolve, reject) => {
      this
        .getFileStats(path)
        .then(stats => {
          if(stats.isDirectory())
            return resolve(true);
          resolve(false);
        })
        .catch(reject);
    });
  }

  static readDir(path) {
    return new Promise((resolve, reject) => {
      function handleFiles(files) {
        for(let i=0; i < files.length; i++)
          files[i] = nodePath.join(path, files[i]);

        resolve(files);
      }

      /* istanbul ignore else */
      if(nodeFs.promises.readdir)
        nodeFs
          .promises
          .readdir(path)
          .then(handleFiles)
          .catch((e) => reject(e));
      else
        nodeFs.readdir(path, (e, files) => {
          if(e)
            return reject(e);

          handleFiles(files);
        });
    });
  }

  static getFileStats(path) {
    return new Promise((resolve, reject) => {
      /* istanbul ignore else */
      if (nodeFs.promises.lstat)
        nodeFs
          .promises
          .lstat(path)
          .then(resolve)
          .catch(reject);
      else
        nodeFs.lstat(path, (e, stats) => {
          if (e)
            return reject(e);

          resolve(stats);
        });
    });
  }

  static readFile(path) {
    return new Promise((resolve, reject) => {
      /* istanbul ignore else */
      if (nodeFs.promises.readFile)
        nodeFs
          .promises
          .readFile(path)
          .then(resolve)
          .catch(reject);
      else
        nodeFs.readFile(path, (e, data) => {
          if (e)
            return reject(e);

          resolve(data);
        });
    });
  }
}
