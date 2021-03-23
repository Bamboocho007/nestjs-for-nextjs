export enum PUBLIC_PATHS {
  articles = 'public/images/articles/',
  articlesThumbnail = 'public/images/articles/thumbnail/',
}

export const getFilePath = (directoryPath: string, fileName: string) =>
  'http://localhost:3001' + directoryPath + fileName;
