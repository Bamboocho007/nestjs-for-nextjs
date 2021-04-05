import { Controller, Get } from '@nestjs/common';
import { ArticleTopicsService } from './article-topics.service';

@Controller()
export class ArticleTopicsController {
  constructor(private _articleTopicsService: ArticleTopicsService) {}

  @Get('/article-topics')
  public async getTopics() {
    return await this._articleTopicsService.getAll();
  }
}
