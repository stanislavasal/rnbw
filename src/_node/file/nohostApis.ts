import { ApiError } from "browserfs/dist/node/core/api_error";
import {
  BFSCallback,
  BFSOneArgCallback,
} from "browserfs/dist/node/core/file_system";
import Stats from "browserfs/dist/node/core/node_fs_stats";
import { Buffer } from "buffer";

// interface FilerStats {
//   dev: string;
//   node: string;
//   type: string;
//   size: number;
//   nlinks: number;
//   atime: string;
//   mtime: string;
//   ctime: string;
//   atimeMs: number;
//   mtimeMs: number;
//   ctimeMs: number;
//   mode: number;
//   uid: number;
//   gid: number;
//   name: string;
// }

export const _createIDBDirectory = async (path: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }
    window.fs.exists(path, function (exists: boolean) {
      if (!exists) {
        window.fs.mkdir(path, (err: Error) => {
          err ? reject(err) : resolve();
        });
      }
    });
  });
};

export const _readIDBFile = async (path: string): Promise<Uint8Array> => {
  return new Promise<Uint8Array>((resolve, reject) => {
    // Read the file using BrowserFS's readFile method
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }
    window.fs.readFile(path, ((err: Error | null, data: Buffer) => {
      if (err) {
        reject(err);
      } else {
        // Convert the Buffer to a Uint8Array
        const uint8Array = new Uint8Array(data.buffer);
        resolve(uint8Array);
      }
    }) as BFSCallback<Buffer>);
  });
};

export const _writeIDBFile = async (
  path: string,
  content: Uint8Array | string,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }
    let bufferContent: Buffer | string;

    // Convert the content to a Buffer if it's a Uint8Array
    if (content instanceof Uint8Array) {
      bufferContent = Buffer.from(content);
    } else {
      bufferContent = content;
    }

    // Write the file using BrowserFS's writeFile method
    window.fs.writeFile(path, bufferContent, ((err: Error | null) => {
      err ? reject(err) : resolve();
    }) as BFSOneArgCallback);
  });
};

export const _removeIDBDirectoryOrFile = async (
  path: string,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }
    window.fs.unlink(path, (err: ApiError | null | undefined) => {
      err ? reject(err) : resolve();
    });
  });
};
export const _readIDBDirectory = async (path: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }

    window.fs.readdir(
      path,
      (err: ApiError | null | undefined, files: string[] | undefined) => {
        if (err) {
          // reject(err);
        } else {
          resolve(files || []);
        }
      },
    );
  });
};
export const _getIDBDirectoryOrFileStat = async (
  path: string,
): Promise<Stats> => {
  return new Promise<Stats>((resolve, reject) => {
    if (!window.fs) {
      reject(new Error("BrowserFS is not initialized."));
      return;
    }
    window.fs.stat(
      path,
      (err: ApiError | null | undefined, stats: Stats | undefined) => {
        err ? reject(err) : resolve(stats!);
      },
    );
  });
};
