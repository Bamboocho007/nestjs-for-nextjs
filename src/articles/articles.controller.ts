import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { NewArticle } from './dto/new-article.interface';

@Controller()
export class ArticlesController {
  constructor(private _articleService: ArticleService) {}

  @Get('/articles')
  async getArticles() {
    return await this._articleService.findAll();
  }

  @Get('/articles/:id')
  public async findArticleById(@Param('id') id: string) {
    return await this._articleService.findById(parseInt(id));
  }

  @Post('/articles/create')
  public async createArticle(@Body() newArticleData: NewArticle) {
    return await this._articleService.add(newArticleData);
  }

  @Delete('/articles/:id')
  public async removeArticle(@Param('id') id: string) {
    return await this._articleService.remove(parseInt(id));
  }
}
