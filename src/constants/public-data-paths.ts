export enum PUBLIC_PATHS {
  articles = '/images/articles/',
  articlesThumbnail = '/images/articles/thumbnail/',
}

export const getFilePath = (directoryPath: string, fileName: string) =>
  'http://localhost:3001' + directoryPath + fileName;
