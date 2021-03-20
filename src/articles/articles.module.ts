import { ArticlesController } from './articles.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/logger.middleware';
import { UsersModule } from 'src/users/users.module';
import { ArticleService } from './article.service';
import { Article } from './models/article.model';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UsersModule],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticlesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
