import { Request } from 'express';

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
