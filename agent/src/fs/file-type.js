/* jshint esversion: 6 */

import fileType from 'file-type';
import readChunk from 'read-chunk';
import mime from 'mime';
import isSvg from 'is-svg';
import { FSUtility } from './utility';
import fileExtension from 'file-extension';

export class FileType {
  static getNonDirectory(path) {
    return new Promise((resolve, reject) => {
      const ext = path.indexOf('.') === -1 ? '' : fileExtension(path);

      readChunk(path, 0, fileType.minimumBytes)
        .then(buffer => {
          return fileType(buffer);
        })
        .then((fileTypeResult) => {
          const mimeVal = mime.getType(ext);

          if (ext === 'nef' && fileTypeResult.mime === 'image/tiff')
            return {
              ext: ext,
              mime: 'image/x-nikon-nef'
            };
          else if (fileTypeResult)
            return fileTypeResult;
          else if(mimeVal !== null && ext !== 'svg')
            return {
              ext: ext,
              mime: mimeVal
            };
          else if(ext === 'svg')
            return FSUtility
              .readFile(path)
              .then(isSvg)
              .then((result) => {
                console.log(result);
                if (result)
                  resolve({
                    ext: ext,
                    mime: mime.getType(ext)
                  });
                else
                  resolve({
                    ext: ext,
                    mime: 'unknown'
                  });
              })
              .catch(e => { throw e; });
          else
            return {
              ext: ext,
              mime: 'unknown'
            };
        })
        .then(resolve)
        .catch(reject);
    });
  }

  static get(path) {
    return new Promise((resolve, reject) => {
      FSUtility.isDirectory(path)
        .then((isDirectory) => {
          if (!isDirectory)
            this
              .getNonDirectory(path)
              .then(resolve)
              .catch(reject);
          else
            resolve({
              ext: '',
              mime: 'directory'
            });
        });
    });
  }
}
