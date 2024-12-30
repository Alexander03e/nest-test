import { ArticleResponse } from '@app/article/types/article-response.interface';

export interface ArticleAllResponse {
  articles: ArticleResponse[];
  total: number;
  totalOnPage?: number;
}
