import {
  fieldFolderStorage,
  imageFileFilter,
  imageLimits,
} from '../shared/upload';

export const profileMulterConfig = {
  storage: fieldFolderStorage({ avatar: 'avatars', coverImage: 'covers' }),
  fileFilter: imageFileFilter,
  limits: imageLimits,
};
