import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any,
) => {
  if (!/\/(jpg|jpeg|png|gif|webp)$/.test(file.mimetype)) {
    return cb(
      new BadRequestException('Only image files are allowed'),
      false,
    );
  }
  cb(null, true);
};

export const imageLimits = { fileSize: 5 * 1024 * 1024 };

const uniqueName = () =>
  Date.now() + '-' + Math.round(Math.random() * 1e9);

/** Хранилище в одну папку — для контроллеров с одним типом загрузки (например, постов). */
export const singleFolderStorage = (subdir: string) => {
  const dir = join(process.cwd(), 'public', subdir);
  mkdirSync(dir, { recursive: true });
  return diskStorage({
    destination: dir,
    filename: (req, file, cb) =>
      cb(null, `${uniqueName()}${extname(file.originalname)}`),
  });
};

/**
 * Хранилище, раскладывающее файлы по папкам в зависимости от имени поля.
 * Пример: { avatar: 'avatars', coverImage: 'covers' } — поле avatar -> public/avatars,
 * coverImage -> public/covers.
 */
export const fieldFolderStorage = (mapping: Record<string, string>) => {
  Object.values(mapping).forEach((sub) =>
    mkdirSync(join(process.cwd(), 'public', sub), { recursive: true }),
  );
  return diskStorage({
    destination: (req, file, cb) => {
      const sub = mapping[file.fieldname];
      if (!sub) return cb(new BadRequestException('Unexpected field'), '');
      cb(null, join(process.cwd(), 'public', sub));
    },
    filename: (req, file, cb) =>
      cb(
        null,
        `${file.fieldname}_${uniqueName()}${extname(file.originalname)}`,
      ),
  });
};
