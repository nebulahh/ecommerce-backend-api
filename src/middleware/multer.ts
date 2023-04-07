import multer from 'multer';
import path from 'path';

export const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb: any) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.JPG') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});