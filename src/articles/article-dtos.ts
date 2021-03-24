export interface ArticleRequestItemInterface {
  id: number;
  title: string;
  text: string;
  creationDate: string;
  userId: number;
  imageUrl: string;
  imageTrumbUrl: string;
}

export interface NewArticleInput {
  title: string;
  text: string;
  image: string;
}
