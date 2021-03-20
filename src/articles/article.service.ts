import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NewArticle } from './dto/new-article.interface';
import { Article } from './models/article.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private _articleRepository: Repository<Article>,
  ) {}

  public async findAll() {
    return await this._articleRepository.find();
  }

  public findById(id: number) {
    return this._articleRepository.findOne({ id });
  }

  public async add(data: NewArticle) {
    const inserted = await this._articleRepository.insert({
      creationDate: new Date(),
      ...data,
    });
    const id = inserted.identifiers[0].id;
    return this._articleRepository.findOne({ id });
  }

  public remove(id: number) {
    return this._articleRepository.delete({ id });
  }
}
