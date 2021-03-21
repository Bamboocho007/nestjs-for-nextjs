import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getFilePath, PUBLIC_PATHS } from 'src/constants/public-data-paths';
import { imagesFileFilter, imagesFileName } from 'src/utils/images-file-filter';
import { ArticleService } from './article.service';
import { NewArticle } from './dto/new-article.interface';

@Controller()
export class ArticlesController {
  constructor(private _articleService: ArticleService) {}

  @Get('/articles')
  async getArticles() {
    const articles = await this._articleService.findAll();
    articles.forEach(
      (art) => (art.image = getFilePath(PUBLIC_PATHS.articles, art.image)),
    );
    return articles;
  }

  @Get('/articles/:id')
  public async findArticleById(@Param('id') id: string) {
    const article = await this._articleService.findById(parseInt(id));
    article.image = getFilePath(PUBLIC_PATHS.articles, article.image);
    return article;
  }

  @Post('/articles/create')
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      fileFilter: imagesFileFilter,
      storage: diskStorage({
        destination: 'public' + PUBLIC_PATHS.articles,
        filename: imagesFileName,
      }),
    }),
  )
  public async createArticle(
    @Body() newArticleData: NewArticle,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this._articleService.add({
      ...newArticleData,
      image: files[0].filename,
    });

    return 'ok';
  }

  @Delete('/articles/:id')
  public async removeArticle(@Param('id') id: string) {
    return await this._articleService.remove(parseInt(id));
  }
}
