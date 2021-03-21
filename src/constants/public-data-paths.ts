export enum PUBLIC_PATHS {
  articles = '/images/articles/',
}

export const getFilePath = (directoryPath: string, fileName: string) =>
  'http://localhost:3001' + directoryPath + fileName;
