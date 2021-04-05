import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleTopic } from './models/article-topic.model';

@Injectable()
export class ArticleTopicsService {
  constructor(
    @InjectRepository(ArticleTopic)
    private _articleTopicRepository: Repository<ArticleTopic>,
  ) {}

  public getAll() {
    return this._articleTopicRepository.find();
  }
}
