import { Request } from 'express';
import * as imagemin from 'imagemin';
import * as imageminPngquant from 'imagemin-pngquant';
import * as imageminMozjpeg from 'imagemin-mozjpeg';

export function imagesFileFilter(req: Request, file: Express.Multer.File, cb) {
  const mimeType = file.mimetype;

  if (mimeType != 'image/jpeg' && mimeType != 'image/png') {
    return cb(new Error('Wrong file type'));
  }
  cb(null, true);
}

export function imagesFileName(req: Request, file: Express.Multer.File, cb) {
  const uniquePrefix = Date.now();
  cb(null, uniquePrefix + '_' + file.originalname);
}

export const imageMinification = (
  files: string[],
  destination: string,
  quality: [number, number],
) =>
  imagemin(files, {
    destination: destination,
    plugins: [
      imageminMozjpeg(),
      imageminPngquant.default({
        quality: quality,
      }),
    ],
  });
