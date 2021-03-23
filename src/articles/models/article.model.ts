import { User } from 'src/users/models/user.model';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  creationDate: string;

  @Column()
  userId: number;

  @Column()
  image: string;

  @ManyToOne((type) => User, (user) => user.articles)
  user: User;
}
