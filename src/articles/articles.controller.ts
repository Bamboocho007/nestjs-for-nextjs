import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getFilePath, PUBLIC_PATHS } from 'src/constants/public-data-paths';
import {
  imageMinification,
  imagesFileFilter,
  imagesFileName,
} from 'src/utils/files-helpers';
import { ArticleService } from './article.service';
import { ArticleRequestItemInterface } from './dto/article-request-item.interface';
import { NewArticle } from './dto/new-article.interface';
import { Article } from './models/article.model';

@Controller()
export class ArticlesController {
  constructor(private _articleService: ArticleService) {}

  @Get('/articles')
  async getArticles(): Promise<ArticleRequestItemInterface[]> {
    const articles = await this._articleService.findAll();

    if (articles) {
      return articles.map((article) => this.getFullArticle(article));
    } else {
      new NotFoundException();
    }
  }

  @Get('/articles/:id')
  public async findArticleById(
    @Param('id') id: string,
  ): Promise<ArticleRequestItemInterface> {
    const article = await this._articleService.findById(parseInt(id));
    if (article) {
      const fullArticle = this.getFullArticle(article);
      return fullArticle;
    } else {
      new NotFoundException();
    }
  }

  @Post('/articles/create')
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      fileFilter: imagesFileFilter,
      storage: diskStorage({
        destination: PUBLIC_PATHS.articles,
        filename: imagesFileName,
      }),
    }),
  )
  public async createArticle(
    @Body() newArticleData: NewArticle,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await imageMinification(
      [PUBLIC_PATHS.articles + files[0].filename],
      PUBLIC_PATHS.articlesThumbnail,
      [0.6, 0.8],
    );

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

  private getFullArticle(article: Article): ArticleRequestItemInterface {
    return {
      ...article,
      imageUrl: getFilePath(PUBLIC_PATHS.articles, article.image),
      imageTrumbUrl: getFilePath(PUBLIC_PATHS.articlesThumbnail, article.image),
    };
  }
}
