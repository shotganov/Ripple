export const postImageUrl = (filename: string) => `/public/posts/${filename}`;

export const avatarUrl = (filename: string | null) =>
  filename ? `/public/avatars/${filename}` : '';

export const coverUrl = (filename: string | null) =>
  filename ? `/public/covers/${filename}` : '';
