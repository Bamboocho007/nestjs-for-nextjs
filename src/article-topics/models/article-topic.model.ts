import { Article } from 'src/articles/models/article.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'article_topics' })
export class ArticleTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  sub: string;

  @OneToMany(() => Article, (article) => article.topicId)
  articles: Article[];
}
