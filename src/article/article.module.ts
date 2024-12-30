import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { User as UserEntity } from '@app/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
