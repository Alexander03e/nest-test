import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guards';
import { ArticleCreateDto } from '@app/article/dto/article-create.dto';
import { User } from '@app/user/decorators/user.decorator';
import { User as UserEntity } from '@app/user/entity/user.entity';
import { ArticleResponse } from '@app/article/types/article-response.interface';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { ArticleUpdateDto } from '@app/article/dto/article-update.dto';
import { ArticleAllResponse } from '@app/article/types/article-all-response.interface';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    console.log(slug);
    return await this.articleService.findBySlug(slug);
  }

  @Get()
  async findAll(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticleAllResponse> {
    return await this.articleService.findAll(userId, query);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @User() user: UserEntity,
    @Body() data: ArticleCreateDto,
  ): Promise<ArticleResponse> {
    return await this.articleService.create(user, data);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async delete(
    @User('id') id: number,
    @Param('slug') slug: string,
  ): Promise<ArticleEntity> {
    return await this.articleService.deleteArticle(id, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async update(
    @User('id') id: number,
    @Param('slug') slug: string,
    @Body() data: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    return await this.articleService.update(id, slug, data);
  }

  @Post(':slug/like')
  @UseGuards(AuthGuard)
  async addToFavorite(@User('id') userId: number, @Param('slug') slug: string) {
    return await this.articleService.addToFavorite(userId, slug);
  }

  @Post(':slug/dislike')
  @UseGuards(AuthGuard)
  async removeFromFavorite(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.removeFromFavorite(userId, slug);
  }
}
