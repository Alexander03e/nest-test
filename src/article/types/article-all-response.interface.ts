import { ArticleType } from '@app/article/types/article.type';

export interface ArticleAllResponse {
  articles: ArticleType[];
  total: number;
  totalOnPage?: number;
}
