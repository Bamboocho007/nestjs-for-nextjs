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
import { PublicDataPaths } from 'src/constants/public-data-paths';
import { imagesFileFilter, imagesFileName } from 'src/utils/images-file-filter';
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
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      fileFilter: imagesFileFilter,
      storage: diskStorage({
        destination: 'public' + PublicDataPaths.articles,
        filename: imagesFileName,
      }),
    }),
  )
  public async createArticle(
    @Body() newArticleData: NewArticle,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this._articleService.add({
      ...newArticleData,
      image: PublicDataPaths.articles + files[0].filename,
    });
  }

  @Delete('/articles/:id')
  public async removeArticle(@Param('id') id: string) {
    return await this._articleService.remove(parseInt(id));
  }
}
