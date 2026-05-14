import {
  imageFileFilter,
  imageLimits,
  singleFolderStorage,
} from '../shared/upload';

export const multerConfig = {
  storage: singleFolderStorage('posts'),
  fileFilter: imageFileFilter,
  limits: { ...imageLimits, files: 4 },
};
