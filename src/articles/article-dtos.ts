export interface ArticleRequestItemInterface {
  id: number;
  title: string;
  text: string;
  creationDate: string;
  userId: number;
  imageUrl: string;
  imageTrumbUrl: string;
  topicId: number;
}

export interface NewArticleInput {
  title: string;
  text: string;
  image: string;
  topicId: number;
}
