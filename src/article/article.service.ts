import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleCreateDto } from '@app/article/dto/article-create.dto';
import { User } from '@app/user/entity/user.entity';
import slugify from 'slugify';
import { ArticleUpdateDto } from '@app/article/dto/article-update.dto';
import { ArticleAllResponse } from '@app/article/types/article-all-response.interface';
import AppDataSource from '../../typeorm.config';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(
    userId: number,
    slug: string,
    data: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Такой статьи нет', HttpStatus.NOT_FOUND);
    }
    if (article.author.id != userId) {
      throw new HttpException(
        'Для редактирования статьи надо быть ее автором',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, data);
    article.slug = this.generateSlug(article.title);
    await this.articleRepository.save(article);
    return article;
  }

  async deleteArticle(userId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Такой статьи нет', HttpStatus.NOT_FOUND);
    }
    if (article.author.id != userId) {
      throw new HttpException(
        'Для удаления статьи надо быть ее автором',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.articleRepository.delete({ slug });
    return article;
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async findAll(userId: number, query: any): Promise<ArticleAllResponse> {
    const queryBuilder = AppDataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author'); // Добавляем author к ответу

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const total = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });

      if (!author) {
        throw new HttpException(
          'Такого пользователя нет',
          HttpStatus.NOT_FOUND,
        );
      }
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();
    const totalOnPage = articles.length;

    return { articles, total, totalOnPage };
  }

  async create(user: User, data: ArticleCreateDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, data);

    if (!data.tagList) {
      article.tagList = [];
    }

    article.slug = this.generateSlug(article.title);
    article.author = user;
    return await this.articleRepository.save(article);
  }

  private generateSlug(title: string): string {
    return (
      slugify(title, {
        lower: true,
      }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
