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

  async removeFromFavorite(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (item) => item.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount -= 1;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async addToFavorite(userId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    });
    const isNotFavorite =
      user.favorites.findIndex((item) => item.id === article.id) === -1;

    if (isNotFavorite) {
      user.favorites.push(article);
      article.favoritesCount += 1;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

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

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });

      const ids = author?.favorites.map((item) => item.id);

      if (ids?.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', {
          ids,
        });
      } else {
        queryBuilder.andWhere('1=0');
      }
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

    let favoritedIds: number[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });

      favoritedIds = user.favorites.map((item) => item.id);
    }

    const articles = await queryBuilder.getMany();
    const totalOnPage = articles.length;

    const articleWithFavorite = articles.map((item) => {
      const favorited = favoritedIds.includes(item.id);

      return { ...item, favorited };
    });

    return { articles: articleWithFavorite, total, totalOnPage };
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
