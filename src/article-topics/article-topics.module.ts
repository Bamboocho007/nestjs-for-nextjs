import { ArticleTopicsService } from './article-topics.service';
import { ArticleTopicsController } from './article-topics.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTopic } from './models/article-topic.model';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTopic])],
  controllers: [ArticleTopicsController],
  providers: [ArticleTopicsService],
})
export class ArticleTopicsModule {}
