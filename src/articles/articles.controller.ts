import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getFilePath, PUBLIC_PATHS } from 'src/constants/public-data-paths';
import {
  imageMinification,
  imagesFileFilter,
  imagesFileName,
} from 'src/utils/files-helpers';
import { ArticleService } from './article.service';
import { Article } from './models/article.model';
import { CurrentUser } from 'src/users/current-user.decorator';
import { User } from 'src/users/models/user.model';
import { ArticleRequestItemInterface, NewArticleInput } from './article-dtos';
import { unlinkSync } from 'fs';

@Controller()
export class ArticlesController {
  constructor(private _articleService: ArticleService) {}

  @Get('/articles')
  async getArticles(): Promise<ArticleRequestItemInterface[]> {
    const articles = await this._articleService.findAll();
    if (articles) {
      return articles.map((article) => this._getFullArticle(article));
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
      const fullArticle = this._getFullArticle(article);
      return fullArticle;
    } else {
      new NotFoundException();
    }
  }

  @Post('/articles/create')
  @UseGuards(JwtAuthGuard)
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
    @Body() newArticleData: NewArticleInput,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<ArticleRequestItemInterface> {
    await imageMinification(
      ['public' + PUBLIC_PATHS.articles + files[0].filename],
      'public' + PUBLIC_PATHS.articlesThumbnail,
      [0.6, 0.8],
    );

    const article = await this._articleService.add({
      ...newArticleData,
      image: files[0].filename,
      userId: user.id,
    });

    return this._getFullArticle(article);
  }

  @Put('/articles/update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      fileFilter: imagesFileFilter,
      storage: diskStorage({
        destination: 'public' + PUBLIC_PATHS.articles,
        filename: imagesFileName,
      }),
    }),
  )
  public async updateArticle(
    @Body() updateArticleData: Partial<NewArticleInput>,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<ArticleRequestItemInterface> {
    await imageMinification(
      ['public' + PUBLIC_PATHS.articles + files[0]?.filename],
      'public' + PUBLIC_PATHS.articlesThumbnail,
      [0.6, 0.8],
    );

    const article = await this._articleService.findById(parseInt(id));

    if (article.userId !== user.id) {
      this._deleteImage(files[0]?.filename);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (files[0]?.filename) {
      this._deleteImage(article.image);
    }

    await this._articleService.update(article.id, {
      ...updateArticleData,
      image: files[0]?.filename || article.image,
    });

    return this._getFullArticle({
      ...article,
      ...updateArticleData,
      image: files[0]?.filename || article.image,
    });
  }

  @Delete('/articles/:id')
  @UseGuards(JwtAuthGuard)
  public async removeArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const article = await this._articleService.findById(parseInt(id));

    if (article.userId !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    this._deleteImage(article.image);

    return await this._articleService.remove(parseInt(id));
  }

  private _deleteImage(path: string) {
    try {
      unlinkSync('public' + PUBLIC_PATHS.articles + path);
      unlinkSync('public' + PUBLIC_PATHS.articlesThumbnail + path);
    } catch (err) {
      console.error(err);
    }
  }

  private _getFullArticle(article: Article): ArticleRequestItemInterface {
    return {
      ...article,
      imageUrl: getFilePath(PUBLIC_PATHS.articles, article.image),
      imageTrumbUrl: getFilePath(PUBLIC_PATHS.articlesThumbnail, article.image),
    };
  }
}
