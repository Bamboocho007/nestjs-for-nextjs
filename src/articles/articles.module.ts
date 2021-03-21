import { ArticlesController } from './articles.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/logger.middleware';
import { UsersModule } from 'src/users/users.module';
import { ArticleService } from './article.service';
import { Article } from './models/article.model';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    UsersModule,
    MulterModule.register({
      dest: './public',
    }),
  ],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticlesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
